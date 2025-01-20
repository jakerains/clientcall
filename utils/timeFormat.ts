export function formatTimeForSpeech(time: string): string {
  // Handle empty or invalid input
  if (!time) return time

  try {
    // Split time into hours and minutes
    const [hours, minutes] = time.split(':').map(num => parseInt(num))
    
    // Convert 24h to 12h format
    const period = hours >= 12 ? 'PM' : 'AM'
    const hour12 = hours % 12 || 12
    
    // Format the time naturally
    if (minutes === 0) {
      return `${hour12} ${period}`
    } else {
      return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`
    }
  } catch (error) {
    console.error('Error formatting time:', error)
    return time
  }
} 