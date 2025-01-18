export interface AppointmentData {
  id: string;
  appointmentId: string;
  clientName: string;
  appointmentDate: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled' | 'noshow';
  statusIndicator?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  personalInfo?: {
    dateOfBirth?: string;
    gender?: string;
    address?: string;
  };
  appointmentDetails?: {
    time?: string;
    location?: string;
    doctor?: string;
    reason?: string;
  };
  medicalHistory?: {
    allergies?: string[];
    conditions?: string[];
    medications?: string[];
  };
  notes?: string[];
  callId?: string;
  lastCallId?: string;
  lastCallDate?: string;
} 