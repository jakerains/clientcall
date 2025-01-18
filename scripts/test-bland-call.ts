const { makeConfirmationCall } = require('../lib/blandApi')
const dotenv = require('dotenv')

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

interface BlandSettings {
  apiKey: string | undefined
  voiceId: number
  maxDuration: number
  language: string
}

interface TestAppointment {
  patientName: string
  appointmentDate: string
  appointmentTime: string
  doctorName: string
}

interface BlandError extends Error {
  response?: {
    data: any
  }
}

const settings: BlandSettings = {
  apiKey: process.env.BLAND_API_KEY,
  voiceId: 0,
  maxDuration: 3,
  language: "eng"
}

const testAppointment: TestAppointment = {
  patientName: "Test Patient",
  appointmentDate: "April 30th",
  appointmentTime: "2:30 PM",
  doctorName: "Dr. Smith's Office"
}

async function formatPhoneNumber(phone: string): Promise<string> {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  // Add +1 if it's not there
  return cleaned.startsWith('1') ? `+${cleaned}` : `+1${cleaned}`
}

async function testBlandCall(phoneNumber: string): Promise<void> {
  console.log('🤖 Starting Bland AI test call...')
  
  const formattedNumber = await formatPhoneNumber(phoneNumber)
  console.log(`📞 Calling ${formattedNumber}...`)
  
  try {
    const result = await makeConfirmationCall(formattedNumber, testAppointment, settings)
    console.log('✅ Call initiated successfully!')
    console.log('📊 Response:', JSON.stringify(result, null, 2))
  } catch (error: unknown) {
    console.error('❌ Error making test call:', error)
    if (error && typeof error === 'object' && 'response' in error) {
      const blandError = error as BlandError
      if (blandError.response?.data) {
        console.error('Error details:', blandError.response.data)
      }
    }
  }
}

// Get phone number from command line argument
const phoneNumber = process.argv[2]

if (!phoneNumber) {
  console.error('❌ Please provide a phone number as an argument')
  console.log('Usage: npm run test-bland-call <phone-number>')
  process.exit(1)
}

testBlandCall(phoneNumber) 