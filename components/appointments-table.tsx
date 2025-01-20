'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CheckCircle, Edit, Phone, Trash2, Search } from 'lucide-react'
import { useAppointments } from "@/contexts/appointments"
import { useToast } from "@/components/ui/use-toast"
import { AppointmentCaller } from "@/components/appointment-caller"
import { useState } from 'react'
import { analyzeCallResult } from '@/lib/blandApi'
import { ClientDetailsSheet } from "@/components/client-details-sheet"
import React from 'react'

// Status indicators mapping
const statusIndicators = {
  confirmed: '✅',
  cancelled: '❌',
  pending: '⏳',
  completed: '✨',
  voicemail: '📞',
  needs_reschedule: '🔄',
  follow_up_needed: '❓',
  calling: '📱'
}

// Status color classes
const statusColors = {
  confirmed: 'text-green-600 bg-green-50 border-green-200',
  cancelled: 'text-red-600 bg-red-50 border-red-200',
  pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  completed: 'text-gray-600 bg-gray-50 border-gray-200',
  voicemail: 'text-blue-600 bg-blue-50 border-blue-200',
  needs_reschedule: 'text-orange-600 bg-orange-50 border-orange-200',
  follow_up_needed: 'text-purple-600 bg-purple-50 border-purple-200',
  calling: 'text-cyan-600 bg-cyan-50 border-cyan-200'
}

export function AppointmentsTable() {
  const { appointments, updateAppointment, deleteAppointment, setSelectedAppointment } = useAppointments()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [analyzingAppointments, setAnalyzingAppointments] = useState<Set<string>>(new Set())
  const [sortConfig, setSortConfig] = useState<{
    key: 'clientName' | 'appointmentDate' | 'status' | null,
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })

  const sortedAppointments = React.useMemo(() => {
    if (!sortConfig.key) return appointments

    return [...appointments].sort((a, b) => {
      if (sortConfig.key === 'clientName') {
        const aValue = a.clientName.toLowerCase()
        const bValue = b.clientName.toLowerCase()
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (sortConfig.key === 'appointmentDate') {
        const aValue = new Date(a.appointmentDate).getTime()
        const bValue = new Date(b.appointmentDate).getTime()
        return sortConfig.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue
      }

      if (sortConfig.key === 'status') {
        const aValue = a.status?.toLowerCase() || ''
        const bValue = b.status?.toLowerCase() || ''
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return 0
    })
  }, [appointments, sortConfig])

  const handleSort = (key: 'clientName' | 'appointmentDate' | 'status') => {
    setSortConfig(current => ({
      key,
      direction: 
        current.key === key && current.direction === 'asc' 
          ? 'desc' 
          : 'asc'
    }))
  }

  const handleVerify = async (appointmentId: string) => {
    try {
      const appointment = appointments.find(a => a.appointmentId === appointmentId)
      if (!appointment) {
        throw new Error('Appointment not found')
      }

      // Check if a call has been completed for this appointment
      if (!appointment.callId) {
        toast({
          variant: "destructive",
          title: "Cannot Verify",
          description: "Please make a confirmation call before verifying the appointment."
        })
        return
      }

      await updateAppointment(appointmentId, appointment.clientName, { 
        status: 'confirmed'
      })
      
      toast({
        title: "Appointment Verified",
        description: "The appointment has been marked as confirmed."
      })
    } catch (error) {
      console.error('Error verifying appointment:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify appointment."
      })
    }
  }

  const handleDelete = async (appointment: Appointment) => {
    try {
      // Try to get an ID from any available field
      const possibleId = appointment.id || appointment.appointmentId || appointment.pk?.replace('APPOINTMENT#', '').replace('APPT#', '') || ''
      
      // Try to get a client name from any available field
      const possibleClientName = appointment.clientName || appointment.sk?.replace('CLIENT#', '') || ''
      
      console.log('Deleting appointment:', { id: possibleId, clientName: possibleClientName })
      await deleteAppointment(possibleId, possibleClientName)
      
      toast({
        title: "Appointment deleted",
        description: "The appointment has been successfully deleted.",
      })
    } catch (error) {
      console.error('Error deleting appointment:', error)
      toast({
        title: "Error",
        description: "Failed to delete the appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete all appointments? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('/api/appointments/delete-all', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete appointments');
      }

      const result = await response.json();
      toast({
        title: "Success",
        description: result.message || 'All appointments deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting appointments:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete appointments',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAnalyzeResult = async (appointmentId: string) => {
    const appointment = appointments.find(a => a.appointmentId === appointmentId)
    if (!appointment) return

    if (!appointment.callId) {
      toast({
        variant: "destructive",
        title: "Cannot Analyze",
        description: "No call has been made for this appointment yet."
      })
      return
    }

    setAnalyzingAppointments(prev => new Set([...prev, appointmentId]))

    try {
      // First analyze the call with specific questions
      const response = await fetch(`https://api.bland.ai/v1/calls/${appointment.callId}/analyze`, {
        method: 'POST',
        headers: {
          'authorization': process.env.NEXT_PUBLIC_BLAND_API_KEY || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          goal: "Determine if the appointment was confirmed and understand the interaction",
          questions: [
            ["Who answered the call?", "human or voicemail or no_answer"],
            ["Did they confirm the appointment?", "boolean"],
            ["Did they request to reschedule?", "boolean"],
            ["Were there any specific notes or requests?", "string"],
            ["What was the overall tone of the conversation?", "positive or negative or neutral"]
          ]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze call')
      }

      const analysis = await response.json()
      
      // Determine status based on analysis
      let status = 'pending'
      let notes: string[] = []

      const [whoAnswered, confirmed, reschedule, specificNotes, tone] = analysis.answers

      if (whoAnswered === 'no_answer') {
        status = 'no_answer'
        notes.push('No answer received')
      } else if (whoAnswered === 'voicemail') {
        status = 'left_message'
        notes.push('Left voicemail message')
      } else if (confirmed === true) {
        status = 'confirmed'
        notes.push('Appointment confirmed')
      } else if (reschedule === true) {
        status = 'rescheduled'
        notes.push('Client requested to reschedule')
      }

      if (specificNotes) {
        notes.push(`Notes: ${specificNotes}`)
      }
      if (tone) {
        notes.push(`Tone: ${tone}`)
      }

      // Update appointment with analysis results
      await updateAppointment(appointmentId, appointment.clientName, {
        status,
        notes
      })

      toast({
        title: "Analysis Complete",
        description: `Status: ${status}${specificNotes ? ' - ' + specificNotes : ''}`
      })
    } catch (error) {
      console.error('Error analyzing call:', error)
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze call results"
      })
    } finally {
      setAnalyzingAppointments(prev => {
        const next = new Set(prev)
        next.delete(appointmentId)
        return next
      })
    }
  }

  return (
    <div className="relative">
      <div className="space-y-4">
        <div className="rounded-md border border-gray-200 overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead 
                  className="font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('clientName')}
                >
                  <div className="flex items-center gap-1">
                    Client Name
                    {sortConfig.key === 'clientName' && (
                      <span className="text-xs">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-600">Contact Info</TableHead>
                <TableHead 
                  className="font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('appointmentDate')}
                >
                  <div className="flex items-center gap-1">
                    Appointment
                    {sortConfig.key === 'appointmentDate' && (
                      <span className="text-xs">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    {sortConfig.key === 'status' && (
                      <span className="text-xs">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAppointments.map((appointment) => (
                <TableRow key={`appointment-${appointment.id}-${appointment.clientName}`} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {appointment.clientName}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {appointment.contactInfo?.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {appointment.contactInfo.phone}
                      </div>
                    )}
                    {appointment.contactInfo?.email && (
                      <div className="text-sm text-gray-500">
                        {appointment.contactInfo.email}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <div>
                      {appointment.appointmentDate}
                      {appointment.appointmentDetails?.time && (
                        <span className="ml-2">{appointment.appointmentDetails.time}</span>
                      )}
                    </div>
                    {appointment.appointmentDetails?.doctor && (
                      <div className="text-sm text-gray-500">
                        {appointment.appointmentDetails.doctor}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm border ${
                      statusColors[appointment.status as keyof typeof statusColors] || statusColors.pending
                    }`}>
                      <span className="mr-1">
                        {statusIndicators[appointment.status as keyof typeof statusIndicators] || statusIndicators.pending}
                      </span>
                      {appointment.status || 'pending'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                        <AppointmentCaller 
                          appointment={{
                            id: appointment.id,
                            appointmentId: appointment.id,
                            clientName: appointment.clientName,
                            appointmentDate: appointment.appointmentDate,
                            contactInfo: appointment.contactInfo,
                            appointmentDetails: {
                              ...appointment.appointmentDetails,
                              doctor: appointment.appointmentDetails?.doctor || "Doctor's Office",
                              time: appointment.appointmentDetails?.time || ''
                            },
                            status: appointment.status,
                            personalInfo: appointment.personalInfo,
                            medicalHistory: appointment.medicalHistory,
                            additionalNotes: appointment.additionalNotes,
                            notes: appointment.notes || []
                          }}
                        />
                      )}
                      {appointment.callId && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                          onClick={() => handleAnalyzeResult(appointment.appointmentId)}
                          disabled={analyzingAppointments.has(appointment.appointmentId)}
                        >
                          {analyzingAppointments.has(appointment.appointmentId) ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Search className="h-4 w-4 mr-1" />
                          )}
                          Get Result
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(appointment)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {appointments.length} appointments
          </div>
          <button
            onClick={handleDeleteAll}
            disabled={isDeleting || !appointments?.length}
            className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-sm transition-all duration-200 
              ${appointments?.length ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-300 cursor-not-allowed text-gray-500'}
              ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Delete all appointments"
          >
            {isDeleting ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete All
          </button>
        </div>
      </div>
    </div>
  )
}

