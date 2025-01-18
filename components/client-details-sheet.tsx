'use client'

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useAppointments } from "@/contexts/appointments"
import { useState, useEffect } from "react"
import { AppointmentData } from "@/types/appointments"

export function ClientDetailsSheet() {
  const { selectedAppointment, updateAppointment, setSelectedAppointment } = useAppointments()
  const [formData, setFormData] = useState<Partial<AppointmentData>>({})

  useEffect(() => {
    if (selectedAppointment) {
      setFormData(selectedAppointment)
    } else {
      setFormData({})
    }
  }, [selectedAppointment])

  const handleClose = () => {
    setSelectedAppointment(null)
    setFormData({})
  }

  const handleSave = async () => {
    if (selectedAppointment?.appointmentId) {
      try {
        await updateAppointment(selectedAppointment.appointmentId, formData)
        handleClose()
      } catch (error) {
        console.error('Error updating appointment:', error)
      }
    }
  }

  return (
    <Sheet open={!!selectedAppointment} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-white overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-gray-900">Appointment Details</SheetTitle>
          <SheetDescription>
            View and edit appointment information for {formData.clientName || 'client'}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-gray-700">Client Name</Label>
            <Input 
              value={formData.clientName || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              className="border-gray-300 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Contact Information</Label>
            <div className="grid gap-2">
              <Input 
                placeholder="Phone"
                value={formData.contactInfo?.phone || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  contactInfo: { ...prev.contactInfo, phone: e.target.value }
                }))}
                className="border-gray-300 focus:border-primary"
              />
              <Input 
                placeholder="Email"
                value={formData.contactInfo?.email || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  contactInfo: { ...prev.contactInfo, email: e.target.value }
                }))}
                className="border-gray-300 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Appointment Details</Label>
            <div className="grid gap-2">
              <Input 
                type="date"
                value={formData.appointmentDate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, appointmentDate: e.target.value }))}
                className="border-gray-300 focus:border-primary"
              />
              <Input 
                placeholder="Time"
                value={formData.appointmentDetails?.time || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  appointmentDetails: { ...prev.appointmentDetails, time: e.target.value }
                }))}
                className="border-gray-300 focus:border-primary"
              />
              <Input 
                placeholder="Location"
                value={formData.appointmentDetails?.location || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  appointmentDetails: { ...prev.appointmentDetails, location: e.target.value }
                }))}
                className="border-gray-300 focus:border-primary"
              />
              <Input 
                placeholder="Doctor"
                value={formData.appointmentDetails?.doctor || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  appointmentDetails: { ...prev.appointmentDetails, doctor: e.target.value }
                }))}
                className="border-gray-300 focus:border-primary"
              />
              <Input 
                placeholder="Reason"
                value={formData.appointmentDetails?.reason || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  appointmentDetails: { ...prev.appointmentDetails, reason: e.target.value }
                }))}
                className="border-gray-300 focus:border-primary"
              />
            </div>
          </div>

          {formData.personalInfo && (
            <div className="space-y-2">
              <Label className="text-gray-700">Personal Information</Label>
              <div className="grid gap-2">
                <Input 
                  placeholder="Date of Birth"
                  value={formData.personalInfo.dateOfBirth || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value }
                  }))}
                  className="border-gray-300 focus:border-primary"
                />
                <Input 
                  placeholder="Gender"
                  value={formData.personalInfo.gender || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    personalInfo: { ...prev.personalInfo, gender: e.target.value }
                  }))}
                  className="border-gray-300 focus:border-primary"
                />
                <Input 
                  placeholder="Address"
                  value={formData.personalInfo.address || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    personalInfo: { ...prev.personalInfo, address: e.target.value }
                  }))}
                  className="border-gray-300 focus:border-primary"
                />
              </div>
            </div>
          )}

          {formData.medicalHistory && (
            <div className="space-y-2">
              <Label className="text-gray-700">Medical History</Label>
              <div className="grid gap-2">
                <div>
                  <Label className="text-sm">Allergies</Label>
                  <Input 
                    value={formData.medicalHistory.allergies?.join(', ') || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      medicalHistory: { 
                        ...prev.medicalHistory, 
                        allergies: e.target.value.split(',').map(s => s.trim()) 
                      }
                    }))}
                    className="border-gray-300 focus:border-primary"
                  />
                </div>
                <div>
                  <Label className="text-sm">Conditions</Label>
                  <Input 
                    value={formData.medicalHistory.conditions?.join(', ') || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      medicalHistory: { 
                        ...prev.medicalHistory, 
                        conditions: e.target.value.split(',').map(s => s.trim()) 
                      }
                    }))}
                    className="border-gray-300 focus:border-primary"
                  />
                </div>
                <div>
                  <Label className="text-sm">Medications</Label>
                  <Input 
                    value={formData.medicalHistory.medications?.join(', ') || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      medicalHistory: { 
                        ...prev.medicalHistory, 
                        medications: e.target.value.split(',').map(s => s.trim()) 
                      }
                    }))}
                    className="border-gray-300 focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.notes && formData.notes.length > 0 && (
            <div className="space-y-2">
              <Label className="text-gray-700">Notes</Label>
              <div className="space-y-1">
                {formData.notes.map((note, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary text-white hover:bg-primary-dark">
              Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

