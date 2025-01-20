export type AppointmentStatus = 
  | "pending" 
  | "confirmed" 
  | "cancelled" 
  | "completed" 
  | "voicemail"
  | "needs_reschedule"
  | "follow_up_needed"
  | "calling"

export interface Appointment {
  id: string
  clientName: string
  appointmentDate: string
  status: string
  statusIndicator?: string
  contactInfo?: {
    phone: string | null
    email: string | null
  }
  personalInfo?: {
    dob: string | null
    gender: string | null
    address: string | null
  }
  appointmentDetails?: {
    location: string | null
    doctor: string | null
    reason: string | null
    time: string | null
  }
  medicalHistory?: {
    allergies: string[]
    conditions: string[]
    medications: string[]
    surgicalHistory: string | null
    familyMedicalHistory: {
      father: string | null
      mother: string | null
    }
  }
  additionalNotes?: {
    preferredCommunication: string | null
    lifestyle: string | null
    dietaryPreferences: string | null
    recentConcerns: string | null
    physicianRemarks: string | null
  }
  notes: Array<{
    timestamp: string
    content: string
  }>
  lastCallId?: string
  lastCallDate?: string
  createdAt?: string
  updatedAt?: string
  // DynamoDB fields
  pk?: string
  sk?: string
  gsi1pk?: string
  gsi1sk?: string
}

export interface AppointmentStats {
  total: number
  pending: number
  confirmed: number
  cancelled: number
  completed: number
}

export interface AppointmentConfirmation {
  id: string
  appointmentId: string
  patientName: string
  appointmentDate: string
  appointmentTime: string
  doctorName: string
  contactInfo: {
    phone: string | null
    email: string | null
  }
  status: string
  personalInfo: {
    dob: string | null
    gender: string | null
    address: string | null
  }
  medicalHistory: {
    allergies: string[]
    conditions: string[]
    medications: string[]
    surgicalHistory: string | null
    familyMedicalHistory: {
      father: string | null
      mother: string | null
    }
  }
  additionalNotes: {
    preferredCommunication: string | null
    lifestyle: string | null
    dietaryPreferences: string | null
    recentConcerns: string | null
    physicianRemarks: string | null
  }
  notes: Array<{
    timestamp: string
    content: string
  }>
}

