// Load environment variables first
import { config } from 'dotenv';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env.local');
console.log('Loading environment variables from:', envPath);
config({ path: envPath });

// Now import modules that use environment variables
import fetch from 'node-fetch';
import { getAppointments } from '../lib/dynamodb';
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";

// Verify required environment variables
const requiredEnvVars = [
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'DYNAMODB_TABLE_NAME'
];

// Log environment variable status
requiredEnvVars.forEach(envVar => {
  console.log(`${envVar}: ${process.env[envVar] ? '✓ Set' : '✗ Missing'}`);
});

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testWebhook() {
  console.log('\nTesting Bland AI webhook...');

  // First, get all appointments from DynamoDB
  try {
    const appointments = await getAppointments();
    if (!appointments || appointments.length === 0) {
      console.error('❌ No appointments found to test with');
      return;
    }

    // Get the most recent appointment that has all required fields
    const testAppointment = appointments.find(a => 
      a.id && a.clientName && a.status === 'pending' && 
      !a.lastCallDate && // Skip appointments that have already been called
      a.appointmentDate // Make sure it has an appointment date
    );

    if (!testAppointment) {
      console.error('❌ No suitable test appointment found');
      return;
    }

    console.log('\nUsing test appointment:', {
      id: testAppointment.id,
      client: testAppointment.clientName,
      status: testAppointment.status,
      date: testAppointment.appointmentDate
    });

    // Simulate a webhook call from Bland AI
    const webhookPayload = {
      call_id: `test_call_${Date.now()}`,
      status: 'completed',
      transcripts: [{
        text: 'Test transcript: Appointment confirmed',
        timestamp: new Date().toISOString()
      }],
      request_data: {
        appointmentId: testAppointment.id,
        clientName: testAppointment.clientName
      }
    };

    console.log('\nSending webhook payload:', webhookPayload);

    // Send webhook request
    const response = await fetch('https://genaijake.io/api/bland-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookPayload)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Webhook request failed: ${error}`);
    }

    const result = await response.json();
    console.log('\nWebhook response:', result);

    // Verify the appointment was updated correctly
    console.log('\nVerifying appointment update...');
    await delay(1000); // Wait for DynamoDB to process the update
    
    const updatedAppointments = await getAppointments();
    
    // Find all records for this appointment
    const appointmentRecords = updatedAppointments.filter(a => 
      a.id === testAppointment.id && 
      a.clientName === testAppointment.clientName &&
      a.pk === `APPOINTMENT#${testAppointment.id}` // Make sure we get the record with the right pk
    );

    console.log('\nFound appointment records:', appointmentRecords.map(a => ({
      id: a.id,
      client: a.clientName,
      status: a.status,
      updatedAt: a.updatedAt,
      pk: a.pk,
      sk: a.sk
    })));

    // Get the most recently updated record
    const updatedAppointment = appointmentRecords
      .sort((a, b) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return bTime - aTime; // Sort descending (most recent first)
      })[0];

    if (!updatedAppointment) {
      throw new Error('Could not find updated appointment');
    }

    console.log('\nSelected most recent record:', {
      id: updatedAppointment.id,
      client: updatedAppointment.clientName,
      status: updatedAppointment.status,
      updatedAt: updatedAppointment.updatedAt,
      pk: updatedAppointment.pk,
      sk: updatedAppointment.sk,
      notes: updatedAppointment.notes
    });

    // Verify the status was updated to 'confirmed'
    if (updatedAppointment.status !== 'confirmed') {
      throw new Error(`Expected status to be 'confirmed' but got '${updatedAppointment.status}'`);
    }

    console.log('✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testWebhook(); 