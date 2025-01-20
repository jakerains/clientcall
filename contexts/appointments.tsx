'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Appointment } from '@/types/appointment'

interface AppointmentsContextType {
  appointments: Appointment[]
  addAppointment: (appointment: Appointment) => Promise<void>
  updateAppointment: (id: string, clientName: string, updates: Partial<Appointment>) => Promise<void>
  deleteAppointment: (id: string, clientName: string) => Promise<void>
  loading: boolean
  error: string | null
  selectedAppointment: Appointment | null
  setSelectedAppointment: React.Dispatch<React.SetStateAction<Appointment | null>>
  refreshAppointments: () => Promise<void>
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

export function AppointmentsProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // Set up SSE listener for real-time updates
  useEffect(() => {
    const eventSource = new EventSource('/api/appointments/events')

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('Received SSE update:', data)
        
        switch (data.type) {
          case 'connected':
            console.log('SSE connection established')
            break
          case 'ping':
            // Ignore ping messages
            break
          case 'appointment_update':
            console.log('Appointment update received:', data)
            // Refresh appointments immediately when we get a webhook update
            refreshAppointments()
            break
          default:
            console.log('Unknown SSE message type:', data.type)
        }
      } catch (error) {
        console.error('Error processing SSE update:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error)
      // Don't close on error - let the browser retry
    }

    return () => {
      console.log('Cleaning up SSE connection')
      eventSource.close()
    }
  }, [])

  // Get the base URL for API calls
  const getApiUrl = (endpoint: string) => {
    if (typeof window === 'undefined') return endpoint
    return `${window.location.origin}${endpoint}`
  }

  const refreshAppointments = async () => {
    try {
      setLoading(true)
      console.log('Fetching appointments...')
      const response = await fetch(getApiUrl('/api/appointments'))
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        throw new Error(errorData.error || 'Failed to fetch appointments')
      }

      const data = await response.json()
      console.log('Fetched appointments:', data)
      setAppointments(data || [])
      setError(null)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      if (error instanceof Error && error.message.includes('Resource not found')) {
        setAppointments([])
      } else {
        setError(error instanceof Error ? error.message : 'Failed to fetch appointments')
      }
    } finally {
      setLoading(false)
    }
  }

  // Fetch appointments on mount
  useEffect(() => {
    refreshAppointments()
  }, [])

  async function addAppointment(appointment: Appointment) {
    try {
      const response = await fetch(getApiUrl('/api/appointments'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add appointment')
      }

      // Refresh appointments from DynamoDB
      await refreshAppointments()
      setError(null)
    } catch (error) {
      console.error('Error adding appointment:', error)
      throw error
    }
  }

  async function updateAppointment(id: string, clientName: string, updates: Partial<Appointment>) {
    try {
      const response = await fetch(getApiUrl(`/api/appointments/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: id,
          clientName,
          updates
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update appointment')
      }

      // Refresh appointments from DynamoDB
      await refreshAppointments()
      setError(null)
    } catch (error) {
      console.error('Error updating appointment:', error)
      throw error
    }
  }

  async function deleteAppointment(id: string, clientName: string) {
    try {
      // Clean the ID by removing any known prefixes
      const cleanId = id
        .replace('APPOINTMENT#', '')
        .replace('APPT#', '')
      
      const response = await fetch(getApiUrl(`/api/appointments/${cleanId}?clientName=${encodeURIComponent(clientName)}`), {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete appointment')
      }

      // Refresh appointments from DynamoDB
      await refreshAppointments()
      setError(null)
    } catch (error) {
      console.error('Error deleting appointment:', error)
      throw error
    }
  }

  return (
    <AppointmentsContext.Provider value={{
      appointments,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      loading,
      error,
      selectedAppointment,
      setSelectedAppointment,
      refreshAppointments
    }}>
      {children}
    </AppointmentsContext.Provider>
  )
}

export function useAppointments() {
  const context = useContext(AppointmentsContext)
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentsProvider')
  }
  return context
} 