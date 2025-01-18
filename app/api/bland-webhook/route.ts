import { NextResponse } from 'next/server'
import { updateAppointment, ensureTableExists } from '@/lib/dynamodb'

// Keep track of active SSE connections
const clients = new Set<ReadableStreamController<any>>()

// Cleanup function to remove closed connections
function removeClient(controller: ReadableStreamController<any>) {
  clients.delete(controller)
}

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller)

      // Send initial connection message
      controller.enqueue('data: Connected to webhook stream\n\n')

      // Remove client when connection closes
      return () => {
        removeClient(controller)
      }
    },
    cancel() {
      // Handle client disconnection
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
    // Ensure table exists before any operations
    await ensureTableExists()
    
    const body = await request.json()
    const { call_id, status, transcripts, request_data, metadata } = body

    console.log('Received webhook:', { call_id, status, request_data, metadata })

    // Check both request_data and metadata for appointment info
    const id = request_data?.appointmentId || metadata?.appointmentId
    const clientName = request_data?.clientName || metadata?.clientName

    if (!id || !clientName) {
      console.error('Missing required data:', { id, clientName, request_data, metadata })
      return NextResponse.json({ error: 'Missing required data in request_data or metadata' }, { status: 400 })
    }

    // Broadcast to all connected clients
    for (const controller of clients) {
      try {
        controller.enqueue(`data: ${JSON.stringify({ call_id, status, request_data, metadata })}\n\n`)
      } catch (error) {
        // If we can't send to this client, remove it
        if (error instanceof Error && error.message.includes('Controller is already closed')) {
          removeClient(controller)
        } else {
          console.error('Error sending SSE update:', error)
        }
      }
    }

    // Prepare update payload with proper key structure
    const updatePayload = {
      clientName,
      status: status === 'completed' ? 'confirmed' : 'pending',
      notes: transcripts?.map((t: any) => ({
        timestamp: new Date().toISOString(),
        content: t.text
      })) || [],
      // Add key structure for DynamoDB
      pk: `APPOINTMENT#${id}`,
      sk: `CLIENT#${clientName}`
    }

    // Update the appointment
    await updateAppointment(id, updatePayload)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process webhook' },
      { status: 500 }
    )
  }
} 