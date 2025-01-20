import { getSecrets } from './secretsManager'

let initialized = false

export async function initializeServer() {
  if (initialized) return

  try {
    // Load initial secrets to populate process.env
    await getSecrets(true)
    initialized = true
    console.log('✅ Server initialized with AWS Secrets')
  } catch (error) {
    console.error('❌ Failed to initialize server with AWS Secrets:', error)
    throw error
  }
} 