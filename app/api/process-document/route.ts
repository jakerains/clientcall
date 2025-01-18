import { NextResponse } from 'next/server'
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime"
import { createAppointment } from '@/lib/dynamodb'

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS credentials not found in environment variables')
}

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
})

// Common CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders
  })
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json()
    
    if (!text) {
      return NextResponse.json(
        { error: 'No text content provided' },
        { status: 400, headers: corsHeaders }
      )
    }

    console.log('Processing document text length:', text.length)

    const command = new InvokeModelCommand({
      modelId: "amazon.nova-micro-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inferenceConfig: {
          max_new_tokens: 1000,
          temperature: 0.01,
          top_p: 0.95,
          top_k: 10
        },
        messages: [
          {
            role: "user",
            content: [
              {
                text: `You are a medical data extraction assistant that outputs strictly formatted JSON. Never include any preamble or explanation text.
                
                Follow these rules:
                1. Output must be valid JSON
                2. Dates must be in YYYY-MM-DD format
                3. Times must be in HH:mm 24-hour format
                4. Arrays must always be arrays even for single items
                5. Use null for missing values, never empty strings
                6. Include all required fields in the schema
                7. Never add fields not in the schema
                8. Never include explanatory text outside JSON
                9. IMPORTANT: For phone numbers:
                   - Look for any phone number labeled as "Phone", "Contact", "Primary", "Cell", "Mobile", "Home", or "Work"
                   - Format should be exactly as written in the document
                   - If multiple numbers exist, prefer Cell/Mobile > Home > Work
                   - Do NOT use emergency contact numbers
                10. For email addresses:
                    - Look for any email labeled as "Email", "Contact", "Primary"
                    - Format should be exactly as written
                11. IMPORTANT: Extract ALL information found in the text, don't skip any fields
                12. If a field is present in the text but not in the exact format required, convert it to the required format
                13. For addresses, include all parts: street, city, state, zip
                14. For names, include full name with any middle names/initials
                15. IMPORTANT: For contact information:
                    - Search the entire document for phone numbers and email addresses
                    - Look in headers, footers, margins, and any sections that might contain contact info
                    - Common formats for phone: (XXX) XXX-XXXX, XXX-XXX-XXXX, XXXXXXXXXX
                    - Common formats for email: name@domain.com, name@domain.co.uk, etc.

                Extract the following information from the provided text into a JSON object with this exact structure:
                {
                  "client_name": "Full name as written",
                  "appointment_date": "YYYY-MM-DD",
                  "appointment_time": "HH:mm",
                  "contact_information": {
                    "phone": "Patient's primary phone number - format exactly as written",
                    "email": "Email exactly as written"
                  },
                  "personal_information": {
                    "dob": "YYYY-MM-DD",
                    "gender": "Gender exactly as written",
                    "address": "Full address as written"
                  },
                  "medical_history": {
                    "allergies": ["Each allergy in a separate array item"],
                    "conditions": ["Each condition in a separate array item", "Use null if none"],
                    "medications": ["Each medication with dosage in a separate array item", "Use null if none"],
                    "surgical_history": "Full surgical history or null if none",
                    "family_medical_history": {
                      "father": "Father's conditions or null",
                      "mother": "Mother's conditions or null"
                    }
                  },
                  "appointment_details": {
                    "location": "Full location name and details",
                    "doctor": "Doctor's full name with title",
                    "reason": "Exact reason as written"
                  },
                  "additional_notes": {
                    "preferred_communication": "Preferred method or null",
                    "lifestyle": "Lifestyle notes or null",
                    "dietary_preferences": "Dietary notes or null",
                    "recent_concerns": "Recent concerns or null",
                    "physician_remarks": "Full physician remarks or null"
                  }
                }

                Document text:
                ${text}`
              }
            ]
          }
        ]
      })
    })

    try {
      const response = await client.send(command)
      const responseBody = new TextDecoder().decode(response.body)
      const parsedResponse = JSON.parse(responseBody)
      
      // Extract the response text from Nova's format
      const responseText = parsedResponse.output?.message?.content?.[0]?.text
      if (!responseText) {
        throw new Error('No data in response')
      }

      // Extract JSON from markdown code block if present
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/)
      const jsonString = jsonMatch ? jsonMatch[1] : responseText

      // Parse the JSON string from the response
      const extractedData = JSON.parse(jsonString)
      
      console.log('Extracted data:', extractedData)

      // Validate required fields
      if (!extractedData.client_name) {
        throw new Error('Missing client name in extracted data')
      }

      // Transform the extracted data to match our AppointmentData structure
      const appointmentData = {
        id: `appt_${Date.now()}`,
        clientName: extractedData.client_name,
        appointmentDate: extractedData.appointment_date,
        status: 'pending',
        statusIndicator: '⏳',
        contactInfo: {
          phone: extractedData.contact_information?.phone || null,
          email: extractedData.contact_information?.email || null
        },
        personalInfo: {
          dob: extractedData.personal_information?.dob || null,
          gender: extractedData.personal_information?.gender || null,
          address: extractedData.personal_information?.address || null
        },
        appointmentDetails: {
          location: extractedData.appointment_details?.location || null,
          doctor: extractedData.appointment_details?.doctor || null,
          reason: extractedData.appointment_details?.reason || null,
          time: extractedData.appointment_time || null
        },
        medicalHistory: {
          allergies: extractedData.medical_history?.allergies || [],
          conditions: extractedData.medical_history?.conditions || [],
          medications: extractedData.medical_history?.medications || [],
          surgicalHistory: extractedData.medical_history?.surgical_history || null,
          familyMedicalHistory: {
            father: extractedData.medical_history?.family_medical_history?.father || null,
            mother: extractedData.medical_history?.family_medical_history?.mother || null
          }
        },
        additionalNotes: {
          preferredCommunication: extractedData.additional_notes?.preferred_communication || null,
          lifestyle: extractedData.additional_notes?.lifestyle || null,
          dietaryPreferences: extractedData.additional_notes?.dietary_preferences || null,
          recentConcerns: extractedData.additional_notes?.recent_concerns || null,
          physicianRemarks: extractedData.additional_notes?.physician_remarks || null
        },
        notes: []
      }

      console.log('Transformed appointment data:', appointmentData)

      // Remove the premature appointment creation
      // Just return the processed data to the client
      return NextResponse.json(appointmentData, { headers: corsHeaders })
    } catch (error) {
      console.error('Error processing with Bedrock:', error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to process document with AI' },
        { status: 500, headers: corsHeaders }
      )
    }
  } catch (error) {
    console.error('Error in document processing:', error)
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500, headers: corsHeaders }
    )
  }
} 