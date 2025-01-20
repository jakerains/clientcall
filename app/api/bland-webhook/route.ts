import { NextResponse } from 'next/server'
import { updateAppointment, ensureTableExists } from '@/lib/dynamodb'
import { clients, removeClient } from '../appointments/events/route'

// Function to analyze conversation using Amazon Nova
async function analyzeConversation(transcript: string, summary: string) {
  try {
    const response = await fetch('https://bedrock-runtime.us-east-1.amazonaws.com/model/amazon.nova-v1/invoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AWS_ACCESS_KEY_ID}:${process.env.AWS_SECRET_ACCESS_KEY}`
      },
      body: JSON.stringify({
        modelId: "amazon.nova-micro-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: {
          inferenceConfig: {
            temperature: 0.8,
            topP: 1,
            maxTokens: 1000,
            stopSequences: ["\n\n<thinking>", "\n<thinking>", " <thinking>"]
          },
          messages: [
            {
              role: "system",
              content: [
                {
                  text: `You are an expert at analyzing medical appointment confirmation calls.
Your task is to determine the outcome of appointment confirmation calls by analyzing the conversation.
You should classify the call outcome into one of these categories:
- confirmed: The patient clearly confirmed they will attend
- needs_reschedule: The patient indicated they need to reschedule
- voicemail: A voicemail was left
- follow_up_needed: The outcome was unclear or needs follow up
- cancelled: The patient cancelled the appointment

Model Instructions:
- Carefully analyze both the full conversation transcript and summary
- Look for clear confirmation or denial language
- Consider context and tone
- Be conservative - if there's any ambiguity, mark as follow_up_needed
- Output only the status category and a brief explanation`
                }
              ]
            },
            {
              role: "user", 
              content: [
                {
                  text: `Please analyze this appointment confirmation call:
                  
Transcript: ${transcript}

Summary: ${summary}

What is the status of this appointment?`
                }
              ]
            }
          ]
        }
      })
    })

    if (!response.ok) {
      throw new Error('Failed to analyze conversation with Nova')
    }

    const result = await response.json()
    const analysis = result.body.messages[0].content[0].text
    
    // Extract status from analysis
    const statusMatch = analysis.match(/confirmed|needs_reschedule|voicemail|follow_up_needed|cancelled/)
    return {
      status: statusMatch ? statusMatch[0] : 'follow_up_needed',
      explanation: analysis
    }
  } catch (error) {
    console.error('Error analyzing conversation:', error)
    return {
      status: 'follow_up_needed',
      explanation: 'Failed to analyze conversation'
    }
  }
}

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller)
      controller.enqueue('data: Connected to webhook stream\n\n')
      return () => {
        removeClient(controller)
      }
    },
    cancel() {
      console.log('Client disconnected from webhook stream')
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

export async function POST(request: Request) {
  try {
    await ensureTableExists()
    
    const body = await request.json()
    const { call_id, status, transcripts, request_data, metadata, summary, concatenated_transcript } = body

    console.log('Received webhook:', { call_id, status, request_data, metadata })

    const id = request_data?.appointmentId || metadata?.appointmentId
    const clientName = request_data?.clientName || metadata?.clientName

    if (!id || !clientName) {
      console.error('Missing required data:', { id, clientName, request_data, metadata })
      return NextResponse.json({ error: 'Missing required data in request_data or metadata' }, { status: 400 })
    }

    let appointmentStatus = 'pending'
    let notes = transcripts?.map((t: any) => ({
      timestamp: new Date(t.created_at).toISOString(),
      type: t.user,
      content: t.text
    })) || []

    // Only analyze completed calls
    if (status === 'completed' && call_id) {
      // Add summary to notes if available
      if (summary) {
        notes.push({
          timestamp: new Date().toISOString(),
          type: 'summary',
          content: summary
        })

        // Check summary for confirmation keywords
        const summaryLower = summary.toLowerCase()
        if (summaryLower.includes('confirmed') || summaryLower.includes('will attend')) {
          appointmentStatus = 'confirmed'
        } else if (summaryLower.includes('reschedule') || summaryLower.includes('change appointment')) {
          appointmentStatus = 'needs_reschedule'
        } else if (summaryLower.includes('voicemail') || summaryLower.includes('left message')) {
          appointmentStatus = 'voicemail'
        } else if (summaryLower.includes('cancel')) {
          appointmentStatus = 'cancelled'
        }
      }

      try {
        // Try Nova analysis only if we haven't determined status from summary
        if (appointmentStatus === 'pending') {
          const analysis = await analyzeConversation(concatenated_transcript || '', summary || '')
          if (analysis.status !== 'follow_up_needed' || !analysis.explanation.includes('Failed to analyze')) {
            appointmentStatus = analysis.status
          }
        }

        // Add analysis to notes
        notes.push({
          timestamp: new Date().toISOString(),
          type: 'analysis',
          content: appointmentStatus === 'confirmed' 
            ? 'Appointment was confirmed during the call.'
            : `Call resulted in status: ${appointmentStatus}`
        })

        await updateAppointment(id, {
          clientName,
          status: appointmentStatus,
          notes,
          pk: `APPOINTMENT#${id}`,
          sk: `CLIENT#${clientName}`,
          lastUpdated: new Date().toISOString()
        })
        console.log('Successfully updated appointment:', { id, clientName, status: appointmentStatus })

        // Broadcast update to all connected clients
        for (const controller of Array.from(clients)) {
          try {
            const data = new TextEncoder().encode(
              `data: ${JSON.stringify({
                type: 'appointment_update',
                appointmentId: id,
                status: appointmentStatus,
                clientName,
                summary: summary || null
              })}\n\n`
            )
            controller.enqueue(data)
          } catch (error) {
            console.error('Error sending SSE update:', error)
            if (error instanceof Error && error.message.includes('Controller is already closed')) {
              removeClient(controller)
            }
          }
        }
      } catch (error) {
        console.error('Error updating appointment in DynamoDB:', error)
        throw error
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 