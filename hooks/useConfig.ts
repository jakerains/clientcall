import { useState, useEffect } from 'react'

interface Config {
  AWS_REGION: string
  BLAND_API_KEY: string
  BLAND_API: string
  DOCUMENT_PROCESSOR_URL: string
  APP_URL: string
  WEBHOOK_URL: string
}

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadConfig() {
      try {
        const response = await fetch('/api/config')
        if (!response.ok) {
          throw new Error('Failed to load configuration')
        }
        const data = await response.json()
        setConfig(data)
        setError(null)
      } catch (err) {
        console.error('Error loading configuration:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  return { config, loading, error }
} 