"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { makeConfirmationCall, analyzeCallResult } from '@/lib/blandApi'
import { useAppointments } from '@/contexts/appointments'
import { AppointmentData } from '@/types/appointments'

interface AppointmentCallerProps {
  appointment: AppointmentData
}

export function AppointmentCaller({ appointment }: AppointmentCallerProps) {
  const { toast } = useToast()
  const { updateAppointment } = useAppointments()
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const canMakeCall = !appointment.status || ['pending', 'no_answer', 'left_message'].includes(appointment.status)
  const canCheckResults = appointment.lastCallId && appointment.status === 'calling'

  const handleCall = async () => {
    setIsLoading(true)
    try {
      // Debug logging
      console.log('Full appointment data:', appointment)

      // Verify required fields
      if (!appointment.appointmentId) {
        console.error('Missing appointment ID:', {
          appointment: appointment
        })
        throw new Error('Missing appointment ID')
      }

      if (!appointment.clientName) {
        console.error('Missing client name:', {
          appointment: appointment
        })
        throw new Error('Missing client name')
      }

      // Get phone number from contact information
      const phoneNumber = appointment.contactInfo?.phone
      if (!phoneNumber) {
        console.error('Missing phone number:', {
          contactInfo: appointment.contactInfo
        })
        throw new Error('Missing phone number')
      }

      const callData = {
        appointmentId: appointment.appointmentId,
        patientName: appointment.clientName,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentDetails?.time || '',
        doctorName: appointment.appointmentDetails?.doctor || 'the doctor'
      }

      console.log('Making confirmation call with data:', callData)

      const result = await makeConfirmationCall(
        phoneNumber,
        callData,
        {
          apiKey: process.env.NEXT_PUBLIC_BLAND_API_KEY
        }
      )

      console.log('Call result:', result)

      toast({
        title: 'Call initiated',
        description: 'The call has been started. Check results in a few moments.',
      })

    } catch (error) {
      console.error('Error making call:', error)
      toast({
        title: 'Error making call',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckResults = async () => {
    if (!appointment.lastCallId || !appointment.appointmentId || !appointment.clientName) return

    setIsAnalyzing(true)
    try {
      const analysis = await analyzeCallResult(
        appointment.lastCallId,
        {
          apiKey: process.env.NEXT_PUBLIC_BLAND_API_KEY
        }
      )

      // Update appointment with analysis results
      await updateAppointment(appointment.appointmentId, appointment.clientName, {
        status: analysis.status,
        notes: analysis.notes
      })

      toast({
        title: 'Call results updated',
        description: `Status: ${analysis.status}`,
      })

    } catch (error) {
      console.error('Error analyzing call:', error)
      toast({
        title: 'Error checking results',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleCall}
        disabled={isLoading || !canMakeCall}
        className={`${
          canMakeCall 
            ? 'bg-blue-500 hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl' 
            : 'bg-gray-300'
        }`}
      >
        {isLoading ? 'Making Call...' : 'Make Confirmation Call'}
      </Button>

      {canCheckResults && (
        <Button
          onClick={handleCheckResults}
          disabled={isAnalyzing}
          className="bg-green-500 hover:bg-green-600 transition-all duration-200"
        >
          {isAnalyzing ? 'Checking...' : 'Check Call Results'}
        </Button>
      )}
    </div>
  )
} 