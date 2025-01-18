import { DynamoDBClient, DescribeTableCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Validate required environment variables
const requiredEnvVars = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'DYNAMODB_TABLE_NAME'
]

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
})

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

const docClient = DynamoDBDocumentClient.from(client)
const TableName = process.env.DYNAMODB_TABLE_NAME!

// Define appointment interface
interface Appointment {
  pk: string
  sk: string
  appointmentId: string
  clientName: string
  status: string
  appointmentDate: string
  createdAt: string
  updatedAt: string
  gsi1pk: string
  gsi1sk: string
  notes: string[]
  [key: string]: any // Allow for additional dynamic fields
}

// Test functions
async function testConnection() {
  try {
    // Try to describe the table
    const command = new DescribeTableCommand({
      TableName
    })
    
    const response = await client.send(command)
    console.log('✅ Successfully connected to DynamoDB')
    console.log('Table details:', {
      name: response.Table?.TableName,
      status: response.Table?.TableStatus,
      itemCount: response.Table?.ItemCount,
      sizeBytes: response.Table?.TableSizeBytes
    })
    return true
  } catch (error) {
    console.error('❌ Failed to connect to DynamoDB:', error)
    return false
  }
}

async function testCreateAppointment(): Promise<Appointment> {
  try {
    const appointmentId = `appt_${Date.now()}`
    const appointment: Appointment = {
      pk: `APPOINTMENT#${appointmentId}`,
      sk: `CLIENT#Test Client`,
      appointmentId,
      clientName: 'Test Client',
      status: 'pending',
      appointmentDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gsi1pk: `DATE#${new Date().toISOString().split('T')[0]}`,
      gsi1sk: `APPOINTMENT#${appointmentId}`,
      notes: []
    }

    const command = new PutCommand({
      TableName,
      Item: appointment
    })

    await docClient.send(command)
    console.log('✅ Successfully created test appointment')
    return appointment
  } catch (error) {
    console.error('❌ Error creating test appointment:', error)
    throw error
  }
}

async function testQueryAppointment(clientName: string, appointmentId: string): Promise<Appointment | null> {
  try {
    const command = new QueryCommand({
      TableName,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `APPOINTMENT#${appointmentId}`
      }
    })

    const response = await docClient.send(command)
    const items = response.Items || []
    
    const appointment = items.find(item => 
      item.sk === `CLIENT#${clientName}`
    ) as Appointment | undefined

    if (!appointment) {
      console.error('❌ Appointment not found')
      return null
    }

    console.log('✅ Successfully queried appointment')
    return appointment
  } catch (error) {
    console.error('❌ Error querying appointment:', error)
    throw error
  }
}

async function testDeleteAppointment(clientName: string, appointmentId: string) {
  try {
    const command = new DeleteCommand({
      TableName,
      Key: {
        pk: `APPOINTMENT#${appointmentId}`,
        sk: `CLIENT#${clientName}`
      }
    })

    await docClient.send(command)
    console.log('✅ Successfully deleted appointment')

    // Verify deletion
    const verifyCommand = new QueryCommand({
      TableName,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `APPOINTMENT#${appointmentId}`
      }
    })

    const response = await docClient.send(verifyCommand)
    const items = response.Items || []

    if (items.length > 0) {
      console.error('❌ Appointment still exists after deletion:', items)
      return false
    }

    console.log('✅ Verified appointment deletion')
    return true
  } catch (error) {
    console.error('❌ Error in delete operation:', error)
    throw error
  }
}

async function testForDuplicates() {
  try {
    // First scan to understand table structure
    const scanCommand = new ScanCommand({
      TableName,
      Limit: 1 // Just get one item to see structure
    })

    const scanResponse = await docClient.send(scanCommand)
    console.log('Table item structure example:', JSON.stringify(scanResponse.Items?.[0], null, 2))

    // Now do full scan for duplicates
    const command = new ScanCommand({
      TableName
    })

    const response = await docClient.send(command)
    const items = response.Items || []
    
    console.log(`Found ${items.length} total items`)
    
    // Group items by their base ID (without prefixes)
    const groupedItems = items.reduce((acc, item) => {
      // Extract client name and appointment ID from composite keys
      const clientName = item.PK?.replace('CLIENT#', '') || item.pk?.replace('CLIENT#', '') || 'unknown'
      const baseId = (item.SK?.replace('APPOINTMENT#', '').replace('APPT#', '') || 
                     item.sk?.replace('APPOINTMENT#', '').replace('APPT#', '') || 
                     'unknown')
      
      const key = `${clientName}-${baseId}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(item)
      return acc
    }, {} as Record<string, any[]>)

    // Check for duplicates
    let hasDuplicates = false
    Object.entries(groupedItems).forEach(([key, items]) => {
      if (items.length > 1) {
        hasDuplicates = true
        console.error(`❌ Found duplicate entries for key ${key}:`, JSON.stringify(items, null, 2))
      }
    })

    if (!hasDuplicates) {
      console.log('✅ No duplicate entries found')
    }

    return !hasDuplicates
  } catch (error) {
    console.error('❌ Error checking for duplicates:', error)
    throw error
  }
}

async function testDataConsistency() {
  try {
    // Create test appointment
    const testAppointment = await testCreateAppointment()
    console.log('Created test appointment:', testAppointment)

    // Query it back immediately
    const queriedAppointment = await testQueryAppointment(
      testAppointment.clientName,
      testAppointment.appointmentId
    )
    
    if (!queriedAppointment) {
      console.error('❌ Failed to query back the test appointment')
      return false
    }
    
    console.log('Queried appointment:', queriedAppointment)

    // Verify all fields match, ignoring field order
    const fieldsMatch = Object.keys(testAppointment).every(key => {
      const originalValue = testAppointment[key as keyof Appointment]
      const queriedValue = queriedAppointment[key as keyof Appointment]
      
      // Special handling for arrays
      if (Array.isArray(originalValue) && Array.isArray(queriedValue)) {
        return JSON.stringify(originalValue) === JSON.stringify(queriedValue)
      }
      
      if (originalValue !== queriedValue) {
        console.error(`❌ Mismatch in field ${key}:`, {
          original: originalValue,
          queried: queriedValue
        })
        return false
      }
      return true
    })

    if (!fieldsMatch) {
      console.error('❌ Data inconsistency detected')
      return false
    }

    console.log('✅ Data consistency verified')

    // Clean up
    await testDeleteAppointment(testAppointment.clientName, testAppointment.appointmentId)
    return true
  } catch (error) {
    console.error('❌ Error testing data consistency:', error)
    throw error
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Starting DynamoDB tests...')

  try {
    // Test 1: Connection
    console.log('\n📡 Testing DynamoDB connection...')
    const connected = await testConnection()
    if (!connected) return

    // Test 2: Check for duplicates
    console.log('\n🔍 Checking for duplicate entries...')
    await testForDuplicates()

    // Test 3: Data consistency
    console.log('\n📊 Testing data consistency...')
    await testDataConsistency()

    // Test 4: Create Appointment
    console.log('\n📝 Testing appointment creation...')
    const testAppointment = await testCreateAppointment()

    // Test 5: Query Appointment
    console.log('\n🔍 Testing appointment query...')
    const queriedAppointment = await testQueryAppointment(
      testAppointment.clientName,
      testAppointment.appointmentId
    )

    // Test 6: Delete Appointment
    console.log('\n🗑️ Testing appointment deletion...')
    const deleted = await testDeleteAppointment(
      testAppointment.clientName,
      testAppointment.appointmentId
    )

    // Final duplicate check
    console.log('\n🔍 Final duplicate check...')
    await testForDuplicates()

    console.log('\n✨ All tests completed!')
  } catch (error) {
    console.error('\n❌ Test suite failed:', error)
    process.exit(1)
  }
}

// Run the test suite
runTests() 