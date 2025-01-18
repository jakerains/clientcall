import { NextResponse } from 'next/server'
import { createAppointment, getAppointments, ensureTableExists, updateAppointment } from '@/lib/dynamodb'
import { Appointment } from '@/types/appointment'

// Common CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders
  })
}

export async function GET() {
  try {
    console.log('GET /api/appointments - Starting request')
    
    // Ensure table exists before any operations
    await ensureTableExists()
    console.log('Table exists, fetching appointments...')
    
    const appointments = await getAppointments()
    console.log('Retrieved appointments:', appointments)
    
    return NextResponse.json(appointments, { headers: corsHeaders })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch appointments' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Ensure table exists before any operations
    await ensureTableExists()

    const appointment = await request.json()
    console.log('Received appointment data:', appointment)

    // Validate required fields
    if (!appointment.clientName || !appointment.appointmentDate) {
      return NextResponse.json(
        { error: 'Missing required fields: clientName and appointmentDate are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Create appointment in DynamoDB
    const createdAppointment = await createAppointment(appointment)
    console.log('Created appointment:', createdAppointment)

    return NextResponse.json(createdAppointment, { 
      status: 201,
      headers: corsHeaders 
    })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create appointment' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    console.log('Received update data:', data)

    const { appointmentId, clientName, updates } = data
    if (!appointmentId || !clientName || !updates) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Add clientName to updates object
    const updateData = {
      ...updates,
      clientName
    }

    await updateAppointment(appointmentId, updateData)
    
    return NextResponse.json({
      success: true,
      appointmentId,
      message: 'Appointment updated successfully'
    })
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to update appointment in database' },
      { status: 500 }
    )
  }
} 