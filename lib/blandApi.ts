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
    task: `Call to confirm a medical appointment. Follow these steps exactly:

1. Start with: "Hi, this is Alexa calling from ${appointment.doctorName}'s office. May I please speak with ${appointment.patientName} or someone who can confirm medical appointments for them?"

2. Wait for their response:
   - If they confirm they are the patient or authorized: "Great, thank you for confirming. I'm calling about your appointment for [Speak the date naturally without the year, like: Wednesday, January 2nd at 3:00 PM] ${appointment.appointmentDate} at ${appointment.appointmentTime}. Would you like to confirm this appointment?"
   - If they say the person is not available: "When would be a better time to reach ${appointment.patientName}?"
   - If they are not authorized: "I'll try calling back at another time. Thank you."

3. If appointment is confirmed:
   - Say: "Perfect, thank you for confirming. Please arrive 15 minutes early. Have a great day!"

4. If they want to cancel the appointment:
   - Say: "I understand. I'll mark this appointment as cancelled. Thank you and have a nice day!"

5. If they can't make the appointment and want to reschedule:
   - Say: "I understand. Is there a better day or time that generally works for you?"
   - After they respond: "Thank you. Someone from our office will follow up soon to reschedule. Have a nice day!"

Always maintain a professional and friendly tone. When speaking the date and time, say it naturally WITHOUT the year, like "Wednesday, January 2nd at 3:00 PM".`,
    model: "turbo",
    language: "en",
    voice: "Alexa",
    max_duration: 2,
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
      ["Did the patient request to cancel the appointment (without rescheduling)?", "boolean"],
      ["Does the patient need to reschedule?", "boolean"],
      ["What days and times work better for the patient if rescheduling?", "string"],
      ["What was the reason for cancelling or rescheduling, if any?", "string"],
      ["Were there any specific concerns or questions mentioned?", "string"],
      ["Did they need directions to the office?", "boolean"],
      ["Did they confirm their contact information?", "boolean"],
      ["What was the overall sentiment of the call?", "string"],
      ["Were there any special accommodations requested?", "string"]
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
      requestedCancel,
      needsReschedule,
      reschedulePreference,
      cancelReason,
      concerns,
      needsDirections,
      confirmedContact,
      sentiment,
      accommodations
    ] = result.answers

    // Determine the new status
    let newStatus = 'pending'
    let notes = []

    if (confirmed) {
      newStatus = 'confirmed'
      notes.push('Appointment was confirmed')
    } else if (requestedCancel) {
      newStatus = 'cancelled'
      notes.push('Appointment was cancelled')
      if (cancelReason) notes.push(cancelReason)
    } else if (needsReschedule) {
      newStatus = 'needs_reschedule'
      notes.push('Appointment needs to be rescheduled')
      if (reschedulePreference) notes.push(`Preferred time: ${reschedulePreference}`)
      if (cancelReason) notes.push(cancelReason)
    }

    // Create a single summary from the notes
    const summary = notes.join('. ')

    return {
      status: newStatus,
      notes: [{
        timestamp: new Date().toISOString(),
        type: 'summary',
        content: summary
      }],
      analysis: result.answers,
      raw: result
    }
  } catch (error) {
    console.error("Error analyzing call:", error)
    throw error
  }
}

