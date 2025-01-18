import { Appointment } from '@/types/appointment'

const BLAND_API = process.env.NEXT_PUBLIC_BLAND_API

if (!BLAND_API) {
  console.error('Bland API is not set in environment variables')
}

export interface BlandSettings {
  apiKey: string | undefined
  voiceId?: number
  maxDuration?: number
  language?: string
}

export interface AppointmentConfirmation {
  appointmentId: string
  patientName: string
  appointmentDate: string
  appointmentTime: string
  doctorName: string
}

export async function makeConfirmationCall(
  phoneNumber: string, 
  appointment: AppointmentConfirmation,
  settings: BlandSettings
) {
  if (!settings.apiKey) {
    throw new Error('Bland API key is not set')
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${settings.apiKey}`
  }

  // Format phone number to E.164 format
  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber.replace(/\D/g, '')}`

  // Create the minimal request data with record ID
  const data = {
    phone_number: formattedPhone,
    task: `Call to confirm medical appointment for ${appointment.patientName} with ${appointment.doctorName} on ${appointment.appointmentDate} at ${appointment.appointmentTime}. Introduce yourself as Alexa from ${appointment.doctorName}'s office. Ask if they can make the appointment. If yes, remind them to arrive 15 minutes early. If they need to reschedule, gather their preferred times.`,
    model: "enhanced",
    language: "en",
    voice: "Alexa",
    max_duration: 1,
    wait_for_greeting: true,
    amd: false,
    voicemail_message: `Hello, this is a call from ${appointment.doctorName}'s office regarding an appointment for ${appointment.patientName}. Please call us back to confirm your appointment.`,
    webhook: 'https://genaijake.io/api/bland-webhook',  // Using genaijake.io for all environments
    metadata: {
      appointmentId: appointment.appointmentId,
      clientName: appointment.patientName
    },
    request_data: {
      appointmentId: appointment.appointmentId,
      clientName: appointment.patientName,
      date: appointment.appointmentDate,
      time: appointment.appointmentTime,
      doctor: appointment.doctorName
    }
  }

  console.log('📤 Sending Bland API request:', JSON.stringify(data, null, 2))

  try {
    const response = await fetch("https://api.bland.ai/v1/calls", {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Bland API error response:', errorData)
      throw new Error(`Bland API error: ${response.statusText}. ${JSON.stringify(errorData)}`)
    }

    const result = await response.json()
    console.log('✅ Bland API response:', result)
    
    // Store the call_id with the appointment through our API
    if (result.call_id) {
      try {
        const updatePayload = {
          appointmentId: appointment.appointmentId,
          clientName: appointment.patientName,
          updates: {
            lastCallId: result.call_id,
            lastCallDate: new Date().toISOString(),
            status: 'calling',
            notes: [{
              timestamp: new Date().toISOString(),
              content: '📞 Call initiated - waiting for response'
            }]
          }
        }

        const updateResponse = await fetch('/api/appointments', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatePayload)
        })

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json()
          console.error('Failed to update appointment with call ID:', errorData)
          throw new Error(`Failed to update appointment: ${JSON.stringify(errorData)}`)
        }

        const updateResult = await updateResponse.json()
        console.log('✅ Successfully updated appointment:', updateResult)
      } catch (updateError) {
        console.error('Error updating appointment:', updateError)
        throw updateError
      }
    }
    
    return result
  } catch (error) {
    console.error("Error making Bland confirmation call:", error)
    throw error
  }
}

export async function analyzeCallResult(callId: string, settings: BlandSettings) {
  if (!settings.apiKey) {
    throw new Error('Bland API key is not set')
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${settings.apiKey}`
  }

  const data = {
    goal: "Analyze appointment confirmation call results and extract key information about the appointment status, rescheduling preferences, and any concerns or questions.",
    questions: [
      ["Did the patient confirm the appointment?", "boolean"],
      ["Does the patient need to reschedule?", "boolean"],
      ["What days and times work better for the patient if rescheduling?", "string"],
      ["What was the reason for rescheduling, if any?", "string"],
      ["Were there any specific concerns or questions mentioned?", "string"],
      ["Did they need directions to the office?", "boolean"],
      ["Did they confirm their contact information?", "boolean"],
      ["What was the overall sentiment of the call?", "string"],
      ["Were there any special accommodations requested?", "string"],
      ["Did they mention any health concerns?", "string"]
    ]
  }

  try {
    const response = await fetch(`https://api.bland.ai/v1/calls/${callId}/analyze`, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Call analysis error:', errorData)
      throw new Error(`Call analysis error: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('📊 Call analysis result:', result)

    // Process the analysis results
    const [
      confirmed,
      needsReschedule,
      reschedulePreference,
      rescheduleReason,
      concerns,
      needsDirections,
      confirmedContact,
      sentiment,
      accommodations,
      healthConcerns
    ] = result.answers

    // Determine the new status
    let newStatus = 'pending'
    let notes = []

    if (confirmed) {
      newStatus = 'confirmed'
      notes.push('✅ Patient confirmed appointment')
    } else if (needsReschedule) {
      newStatus = 'needs_reschedule'
      notes.push('🔄 Patient needs to reschedule')
      if (reschedulePreference) notes.push(`📅 Preferred time: ${reschedulePreference}`)
      if (rescheduleReason) notes.push(`📝 Reason: ${rescheduleReason}`)
    }

    // Add other relevant information to notes
    if (concerns) notes.push(`❗ Concerns: ${concerns}`)
    if (needsDirections) notes.push('🗺️ Needs directions to office')
    if (accommodations) notes.push(`⚡ Special needs: ${accommodations}`)
    if (healthConcerns) notes.push(`🏥 Health concerns: ${healthConcerns}`)
    if (sentiment) notes.push(`💭 Call sentiment: ${sentiment}`)

    return {
      status: newStatus,
      notes,
      analysis: result.answers,
      raw: result
    }
  } catch (error) {
    console.error("Error analyzing call:", error)
    throw error
  }
}

