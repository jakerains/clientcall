import { NextResponse } from 'next/server'
import { getSecrets } from '@/lib/secretsManager'

export async function GET() {
  try {
    const secrets = await getSecrets()

    // Only return public configuration values
    const publicConfig = {
      AWS_REGION: secrets.NEXT_PUBLIC_AWS_REGION,
      BLAND_API_KEY: secrets.NEXT_PUBLIC_BLAND_API_KEY,
      BLAND_API: secrets.NEXT_PUBLIC_BLAND_API,
      DOCUMENT_PROCESSOR_URL: secrets.NEXT_PUBLIC_DOCUMENT_PROCESSOR_URL,
      APP_URL: secrets.NEXT_PUBLIC_APP_URL,
      WEBHOOK_URL: secrets.NEXT_PUBLIC_WEBHOOK_URL
    }

    return NextResponse.json(publicConfig)
  } catch (error) {
    console.error('Error retrieving configuration:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve configuration' },
      { status: 500 }
    )
  }
} 