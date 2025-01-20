import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, AlertCircle, Calendar, Loader2 } from 'lucide-react'
import { useAppointments } from "@/contexts/appointments"

export function StatsSection() {
  const { appointments, isLoading, error } = useAppointments()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading appointments: {error.message}
      </div>
    )
  }

  const stats = {
    total: appointments?.length || 0,
    pending: appointments?.filter(apt => 
      apt.status === 'pending' || 
      apt.status === 'calling'
    ).length || 0,
    confirmed: appointments?.filter(apt => apt.status === 'confirmed').length || 0,
    needsAction: appointments?.filter(apt => 
      apt.status === 'voicemail' || 
      apt.status === 'needs_reschedule' || 
      apt.status === 'follow_up_needed'
    ).length || 0,
    failed: appointments?.filter(apt => 
      apt.status === 'cancelled' || 
      apt.status === 'completed'
    ).length || 0
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Appointments</CardTitle>
          <Calendar className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-yellow-600">Pending</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-600">Confirmed</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-600">Needs Action</CardTitle>
          <AlertCircle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.needsAction}</div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Completed/Cancelled</CardTitle>
          <Calendar className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{stats.failed}</div>
        </CardContent>
      </Card>
    </div>
  )
}

