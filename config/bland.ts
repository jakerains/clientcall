import { formatTimeForSpeech } from '@/utils/timeFormat'

export const blandConfig = {
  headers: {
    'Authorization': process.env.BLAND_API_KEY,
    'x-bland-org-id': 'e7ebba91-a600-4da7-8ea6-cb7594bd8625'
  },
  defaultCallConfig: {
    model: "turbo", // Using enhanced model for better natural language
    language: "en",
    voice: "Nova", // Using Nova voice which tends to be more natural
    voice_settings: {
      stability: 0.60,  // Slightly reduced for more natural variation
      similarity_boost: 0.75  // Balanced for natural yet clear speech
    },
    max_duration: "2",
    wait_for_greeting: true,
    noise_cancellation: true,
    temperature: 0.85,  // Increased for more natural conversation flow
    interruption_threshold: 75,  // Lower to allow for more natural back-and-forth
    background_track: "none",
    timezone: "America/Chicago",
    pronunciation_guide: [
      // Add common medical terms or names that need specific pronunciation
      { word: "Dr.", pronunciation: "doctor" },
      { word: "PM", pronunciation: "P M" },
      { word: "AM", pronunciation: "A M" }
    ]
  }
}

// Helper to create call configuration
export function createCallConfig(phoneNumber: string, task: string, metadata: any = {}) {
  // Format any times in the task string
  const timeRegex = /\b(\d{1,2}):(\d{2})\b/g
  const formattedTask = task.replace(timeRegex, (match) => formatTimeForSpeech(match))

  return {
    ...blandConfig.defaultCallConfig,
    phone_number: phoneNumber,
    task: formattedTask,
    metadata,
    webhook: "https://genaijake.io/api/bland-webhook"
  }
}

// Example task template with natural language
export const taskTemplates = {
  confirmAppointment: (name: string, date: string, time: string, doctor: string) => {
    const formattedTime = formatTimeForSpeech(time)
    return `Hi! I'm calling to confirm an appointment for ${name} on ${date} at ${formattedTime} with ${doctor}. 
    If they're available, I'd like to:
    1. Confirm they can make the appointment
    2. Remind them to arrive 15 minutes early
    3. Ask if they have any questions
    
    Use a friendly, conversational tone and adapt to their responses naturally. 
    If they need to reschedule or can't make it, let them know that's not a problem and we'll note that in the system.
    
    If reaching voicemail: Leave a brief message with the appointment details and ask them to call back to confirm.`
  }
} 