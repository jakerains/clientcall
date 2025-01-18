import { config } from 'dotenv';
import { resolve } from 'path';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Verify AWS credentials
const requiredEnvVars = [
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

// Initialize Bedrock client
const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

// Sample medical document text for testing
const sampleText = `Springfield Medical Clinic
123 Elm Street, Springfield, IL 62701
Phone: (555) 765-4321 | Email: info@springfieldclinic.com
Patient Record

Name: Frank White
Date of Birth: November 25, 1968
Gender: Female
Address: 606 Ash Ct, Springfield, IL 62706
Phone Number: 712-223-0473
Email: frank.white@example.com
Emergency Contact: Jane Doe - (555) 987-6543

Insurance Information
Provider: HealthyLife Insurance Co.
Policy Number: HLIC123455
Group Number: HL12345
Coverage: Comprehensive (includes dental and vision)

Medical History
Allergies: Penicillin, Nuts
Chronic Conditions: None
Medications: None
Surgical History: Appendectomy (2009)
Family Medical History:
 - Father: Diabetes Type II
 - Mother: Diabetes Type II

Recent Visits
1. Date: November 5, 2024
  Reason: Routine Check-up
  Outcome: Stable vitals, recommended exercise plan
2. Date: August 20, 2024
  Reason: Allergy Flare-Up
  Outcome: Prescribed medication, advised on allergen avoidance

Upcoming Appointment
Date: January 20, 2025, 3:15 PM
Reason: Heart Check-up
Location: Springfield Medical Clinic, Suite 202
Assigned Doctor: Dr. Emily Harper

Physician Remarks
Patient needs improvement on dietary habits.
Discuss potential stress management techniques at the next appointment.`;

async function testNovaModel() {
  console.log('🏃 Starting Nova Model Integration Test...\n');
  
  try {
    console.log('AWS Configuration:');
    console.log('Region:', process.env.AWS_REGION);
    console.log('Access Key ID:', process.env.AWS_ACCESS_KEY_ID?.slice(0, 8) + '...');
    
    const prompt = `You are a medical data extraction assistant that outputs strictly formatted JSON. Never include any preamble or explanation text.
                
    Follow these rules:
    1. Output must be valid JSON
    2. Dates must be in YYYY-MM-DD format
    3. Times must be in HH:mm 24-hour format
    4. Arrays must always be arrays even for single items
    5. Use null for missing values, never empty strings
    6. Include all required fields in the schema
    7. Never add fields not in the schema
    8. Never include explanatory text outside JSON

    Extract the following information from the provided text into a JSON object with this exact structure:
    {
      "client_name": "Full name as written",
      "appointment_date": "YYYY-MM-DD",
      "appointment_time": "HH:mm",
      "contact_information": {
        "phone": "Phone number exactly as written",
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
    ${sampleText}`;

    console.log('\nSending request to Nova model...');
    
    const command = new InvokeModelCommand({
      modelId: "amazon.nova-micro-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inferenceConfig: {
          max_new_tokens: 1000,
          temperature: 0.1,
          top_p: 0.9,
          top_k: 50
        },
        messages: [
          {
            role: "user",
            content: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    const response = await client.send(command);
    const responseBody = new TextDecoder().decode(response.body);
    console.log('\nRaw response:', responseBody);
    
    const parsedResponse = JSON.parse(responseBody);
    console.log('\nParsed response:', JSON.stringify(parsedResponse, null, 2));
    
    // Extract the response text from Nova's format
    const responseText = parsedResponse.output?.message?.content?.[0]?.text;
    if (!responseText) {
      console.error('\nUnexpected response format:', parsedResponse);
      throw new Error('No data in response');
    }

    // Extract JSON from markdown code block if present
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : responseText;

    // Parse the JSON string from the response
    const jsonData = JSON.parse(jsonString);
    
    console.log('\n✅ Successfully received and parsed response:');
    console.log(JSON.stringify(jsonData, null, 2));
    
    // Verify required fields are present
    const requiredFields = [
      'client_name',
      'appointment_date',
      'appointment_time',
      'contact_information',
      'personal_information',
      'medical_history',
      'appointment_details',
      'additional_notes'
    ];

    const missingFields = requiredFields.filter(field => !jsonData[field]);
    if (missingFields.length > 0) {
      console.warn('\n⚠️ Warning: Missing required fields:', missingFields.join(', '));
    } else {
      console.log('\n✅ All required fields are present in the response');
    }

    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    if (error instanceof Error) {
      if (error.message.includes('UnrecognizedClientException')) {
        console.error('\nThis error suggests an issue with AWS credentials:');
        console.error('1. Check that your AWS credentials are valid');
        console.error('2. Verify that the IAM user has the correct Bedrock permissions');
        console.error('3. Make sure the credentials have not expired');
      } else if (error.message.includes('ValidationException')) {
        console.error('\nThis error suggests an issue with the request format:');
        console.error('1. Check that the model ID is correct');
        console.error('2. Verify the request body structure');
        console.error('3. Make sure all parameters are within valid ranges');
      }
    }
    process.exit(1);
  }
}

// Run the test
testNovaModel(); 