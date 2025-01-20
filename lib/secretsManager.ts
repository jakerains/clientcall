import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager"

let cachedSecrets: SecretEnvVars | null = null
let client: SecretsManagerClient | null = null

export interface SecretEnvVars {
  NEXT_PUBLIC_AWS_REGION: string
  AWS_ACCESS_KEY_ID: string
  AWS_SECRET_ACCESS_KEY: string
  AWS_REGION: string
  DYNAMODB_TABLE_NAME: string
  NEXT_PUBLIC_BLAND_API_KEY: string
  NEXT_PUBLIC_BLAND_API: string
  NEXT_PUBLIC_DOCUMENT_PROCESSOR_URL: string
  NGROK_AUTHTOKEN: string
  NGROK_DOMAIN: string
  NEXT_PUBLIC_APP_URL: string
  NEXT_PUBLIC_WEBHOOK_URL: string
}

// Initialize with AWS credentials
export function initializeSecretsManager(credentials: { 
  accessKeyId: string, 
  secretAccessKey: string, 
  region?: string 
}) {
  console.log('🔐 Initializing Secrets Manager with provided credentials')
  client = new SecretsManagerClient({
    region: credentials.region || 'us-east-1',
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey
    }
  })
}

export async function getSecrets(forceRefresh = false): Promise<SecretEnvVars> {
  // Return cached secrets if available and not forcing refresh
  if (cachedSecrets && !forceRefresh) {
    console.log('📦 Using cached secrets')
    return cachedSecrets
  }

  if (!client) {
    // If no client exists, try to initialize with environment variables
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    const region = process.env.AWS_REGION

    if (!accessKeyId || !secretAccessKey) {
      console.error('❌ AWS credentials not found in environment variables')
      throw new Error('AWS credentials not found. Please initialize SecretsManager first.')
    }

    console.log('🔄 Initializing Secrets Manager with environment variables')
    initializeSecretsManager({
      accessKeyId,
      secretAccessKey,
      region
    })
  }

  try {
    console.log('🔍 Fetching secrets from AWS Secrets Manager...')
    const command = new GetSecretValueCommand({
      SecretId: 'clientcalljr/env'
    })

    const response = await client!.send(command)
    if (!response.SecretString) {
      throw new Error('No secret string found')
    }

    // Parse the secret string as JSON
    const secrets = JSON.parse(response.SecretString) as SecretEnvVars
    console.log('✅ Successfully retrieved secrets from AWS')

    // Cache the secrets
    cachedSecrets = secrets

    // Set process.env variables for server-side use
    Object.entries(secrets).forEach(([key, value]) => {
      if (typeof value === 'string') {
        process.env[key] = value
      }
    })

    return secrets
  } catch (error) {
    console.error('❌ Error retrieving secrets:', error)
    throw error
  }
}

// Helper function to get a specific secret
export async function getSecret(key: keyof SecretEnvVars): Promise<string> {
  const secrets = await getSecrets()
  return secrets[key]
}

// Helper function to check if we're running on the server
export const isServer = typeof window === 'undefined' 