import { NextResponse } from 'next/server'
import { deleteAppointment, updateAppointment, ensureTableExists } from '@/lib/dynamodb'

// Common CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure table exists before any operations
    await ensureTableExists()
    
    const updates = await request.json()
    await updateAppointment(params.id, updates)
    return NextResponse.json(
      { success: true, message: 'Appointment updated successfully' },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update appointment' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure table exists before any operations
    await ensureTableExists()
    
    // Get the client name from the query parameters
    const url = new URL(request.url)
    const clientName = url.searchParams.get('clientName')
    
    if (!clientName) {
      return NextResponse.json(
        { error: 'Missing clientName parameter' },
        { status: 400, headers: corsHeaders }
      )
    }

    console.log('Deleting appointment:', { id: params.id, clientName })
    await deleteAppointment(params.id, clientName)
    return NextResponse.json(
      { success: true, message: 'Appointment deleted successfully' },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete appointment' },
      { status: 500, headers: corsHeaders }
    )
  }
} 