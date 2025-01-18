'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { extractAppointmentData } from '@/lib/documentParser'
import { useAppointments } from '@/contexts/appointments'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Appointment } from '@/types/appointment'

export function UploadSection() {
  const { addAppointment } = useAppointments()
  const [extractedInfo, setExtractedInfo] = useState<any | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const setupSSE = () => {
    // Use the current window location to determine the webhook URL
    const webhookUrl = typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.host}/api/bland-webhook`
      : '/api/bland-webhook'

    console.log('Setting up SSE connection to:', webhookUrl)

    const eventSource = new EventSource(webhookUrl, {
      withCredentials: false
    })

    eventSource.onopen = () => {
      console.log('SSE connection opened')
    }

    eventSource.onmessage = (event) => {
      console.log('SSE message received:', event.data)
      try {
        const data = JSON.parse(event.data)
        // Handle the webhook data
        if (data.type === 'call.completed') {
          // Refresh appointments list or update UI
          console.log('Call completed:', data)
        }
      } catch (error) {
        console.log('Received ping:', event.data)
      }
    }

    let retryCount = 0
    const maxRetries = 3

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error)
      // Close the errored connection
      eventSource.close()
      
      // Attempt to reconnect with exponential backoff
      if (retryCount < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000)
        console.log(`Retrying connection in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`)
        setTimeout(setupSSE, delay)
        retryCount++
      } else {
        console.log('Max retry attempts reached, stopping reconnection attempts')
      }
    }

    return eventSource
  }

  useEffect(() => {
    const eventSource = setupSSE()
    
    return () => {
      console.log('Cleaning up SSE connection')
      eventSource.close()
    }
  }, [])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    setIsProcessing(true)
    try {
      const file = acceptedFiles[0]
      const data = await extractAppointmentData(file)
      console.log('Extracted data from PDF:', data)
      
      // Transform the data into our Appointment type
      const appointmentData: Partial<Appointment> = {
        id: `appt_${Date.now()}`,
        clientName: data.clientName,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentDetails?.time,
        status: 'pending',
        contactInfo: {
          phone: data.contactInfo?.phone || null,
          email: data.contactInfo?.email || null
        },
        personalInfo: {
          dob: data.personalInfo?.dob || null,
          gender: data.personalInfo?.gender || null,
          address: data.personalInfo?.address || null
        },
        appointmentDetails: {
          location: data.appointmentDetails?.location || null,
          doctor: data.appointmentDetails?.doctor || null,
          reason: data.appointmentDetails?.reason || null,
          time: data.appointmentDetails?.time || null
        },
        medicalHistory: {
          allergies: data.medicalHistory?.allergies || [],
          conditions: data.medicalHistory?.conditions || [],
          medications: data.medicalHistory?.medications || [],
          surgicalHistory: data.medicalHistory?.surgicalHistory || null,
          familyMedicalHistory: {
            father: data.medicalHistory?.familyMedicalHistory?.father || null,
            mother: data.medicalHistory?.familyMedicalHistory?.mother || null
          }
        },
        additionalNotes: {
          preferredCommunication: data.additionalNotes?.preferredCommunication || null,
          lifestyle: data.additionalNotes?.lifestyle || null,
          dietaryPreferences: data.additionalNotes?.dietaryPreferences || null,
          recentConcerns: data.additionalNotes?.recentConcerns || null,
          physicianRemarks: data.additionalNotes?.physicianRemarks || null
        },
        notes: []
      }
      
      console.log('Transformed appointment data:', appointmentData)
      setExtractedInfo(appointmentData)
      setShowConfirmation(true)
      
      toast({
        title: 'PDF Processed Successfully',
        description: 'Please review the extracted information.'
      })
    } catch (error) {
      console.error('Error processing PDF:', error)
      toast({
        title: 'Error Processing PDF',
        description: error instanceof Error ? error.message : 'Failed to process the PDF file',
        variant: 'destructive'
      })
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  })

  const handleConfirm = async () => {
    try {
      await addAppointment(extractedInfo as Appointment)
      setShowConfirmation(false)
      setExtractedInfo(null)
      toast({
        title: 'Appointment Added',
        description: 'The appointment has been successfully added to the system.'
      })
    } catch (error) {
      toast({
        title: 'Error Adding Appointment',
        description: 'Failed to add the appointment to the system.',
        variant: 'destructive'
      })
    }
  }

  return (
    <>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <p>Processing PDF...</p>
        ) : isDragActive ? (
          <p>Drop the PDF here...</p>
        ) : (
          <p>Drag & drop a PDF here, or click to select one</p>
        )}
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Appointment Details</DialogTitle>
            <DialogDescription>
              Please review the extracted appointment information below before confirming.
            </DialogDescription>
          </DialogHeader>
          
          {extractedInfo && (
            <div className="grid gap-4">
              <div>
                <h4 className="font-medium text-sm text-gray-500">Client Information</h4>
                <p className="mt-1">{extractedInfo.clientName}</p>
                {extractedInfo.personalInfo && (
                  <div className="mt-2 text-sm">
                    {extractedInfo.personalInfo.dateOfBirth && (
                      <p>DOB: {extractedInfo.personalInfo.dateOfBirth}</p>
                    )}
                    {extractedInfo.personalInfo.gender && (
                      <p>Gender: {extractedInfo.personalInfo.gender}</p>
                    )}
                    {extractedInfo.personalInfo.address && (
                      <p>Address: {extractedInfo.personalInfo.address}</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-500">Contact Information</h4>
                <div className="mt-1 text-sm">
                  {extractedInfo.contactInfo?.phone && (
                    <p>Phone: {extractedInfo.contactInfo.phone}</p>
                  )}
                  {extractedInfo.contactInfo?.email && (
                    <p>Email: {extractedInfo.contactInfo.email}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-500">Appointment Details</h4>
                <div className="mt-1">
                  <p>Date: {extractedInfo.appointmentDate}</p>
                  {extractedInfo.appointmentTime && (
                    <p>Time: {extractedInfo.appointmentTime}</p>
                  )}
                  {extractedInfo.appointmentDetails && (
                    <>
                      {extractedInfo.appointmentDetails.location && (
                        <p>Location: {extractedInfo.appointmentDetails.location}</p>
                      )}
                      {extractedInfo.appointmentDetails.doctor && (
                        <p>Doctor: {extractedInfo.appointmentDetails.doctor}</p>
                      )}
                      {extractedInfo.appointmentDetails.reason && (
                        <p>Reason: {extractedInfo.appointmentDetails.reason}</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {extractedInfo.medicalHistory && (
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Medical History</h4>
                  <div className="mt-1 space-y-2">
                    {Array.isArray(extractedInfo.medicalHistory.allergies) && extractedInfo.medicalHistory.allergies.length > 0 && (
                      <div>
                        <p className="font-medium">Allergies:</p>
                        <ul className="list-disc list-inside">
                          {extractedInfo.medicalHistory.allergies.map((allergy: string, index: number) => (
                            <li key={index}>{allergy}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {Array.isArray(extractedInfo.medicalHistory.conditions) && extractedInfo.medicalHistory.conditions.length > 0 && (
                      <div>
                        <p className="font-medium">Conditions:</p>
                        <ul className="list-disc list-inside">
                          {extractedInfo.medicalHistory.conditions.map((condition: string, index: number) => (
                            <li key={index}>{condition}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {Array.isArray(extractedInfo.medicalHistory.medications) && extractedInfo.medicalHistory.medications.length > 0 && (
                      <div>
                        <p className="font-medium">Medications:</p>
                        <ul className="list-disc list-inside">
                          {extractedInfo.medicalHistory.medications.map((medication: string, index: number) => (
                            <li key={index}>{medication}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {extractedInfo.notes && extractedInfo.notes.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Notes</h4>
                  <ul className="mt-1 space-y-1">
                    {extractedInfo.notes.map((note: string, index: number) => (
                      <li key={index} className="text-sm">{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Confirm & Add Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


