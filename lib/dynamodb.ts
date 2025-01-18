import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { Appointment } from '@/types/appointment'

// Initialize DynamoDB client lazily
let client: DynamoDBClient | null = null;
let docClient: DynamoDBDocumentClient | null = null;

function getClient() {
  if (!client) {
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

    client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    })
    docClient = DynamoDBDocumentClient.from(client)
  }
  
  // Assert that the clients are initialized
  if (!client || !docClient) {
    throw new Error('Failed to initialize DynamoDB clients')
  }
  
  return { client, docClient }
}

const TableName = process.env.DYNAMODB_TABLE_NAME!

// Function to ensure table exists
export async function ensureTableExists() {
  const { client } = getClient()
  try {
    // Try to describe the table first
    const describeCommand = new DescribeTableCommand({
      TableName
    })

    try {
      await client.send(describeCommand)
      console.log('Table exists:', TableName)
      return true
    } catch (error: any) {
      // If table doesn't exist, create it
      if (error.name === 'ResourceNotFoundException') {
        console.log('Table does not exist, creating...')
        const createCommand = new CreateTableCommand({
          TableName,
          AttributeDefinitions: [
            { AttributeName: 'pk', AttributeType: 'S' },
            { AttributeName: 'sk', AttributeType: 'S' },
            { AttributeName: 'gsi1pk', AttributeType: 'S' },
            { AttributeName: 'gsi1sk', AttributeType: 'S' }
          ],
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
            { AttributeName: 'sk', KeyType: 'RANGE' }
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi1',
              KeySchema: [
                { AttributeName: 'gsi1pk', KeyType: 'HASH' },
                { AttributeName: 'gsi1sk', KeyType: 'RANGE' }
              ],
              Projection: {
                ProjectionType: 'ALL'
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
              }
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        })

        await client.send(createCommand)
        console.log('Table created successfully')
        return true
      }
      throw error
    }
  } catch (error) {
    console.error('Error ensuring table exists:', error)
    throw error
  }
}

export async function createAppointment(appointment: Appointment): Promise<Appointment> {
  console.log('Creating appointment in DynamoDB:', appointment)
  const { docClient } = getClient()
  
  try {
    // Use existing id if provided, otherwise generate new one
    const newId = appointment.id || `appt_${Date.now()}`
    const { clientName, appointmentDate, status, notes, appointmentDetails, personalInfo, contactInfo, ...rest } = appointment
    
    // Check if appointment already exists
    const existingCommand = new QueryCommand({
      TableName,
      KeyConditionExpression: 'pk = :pk AND sk = :sk',
      ExpressionAttributeValues: {
        ':pk': `APPOINTMENT#${newId}`,
        ':sk': `CLIENT#${clientName}`
      }
    })

    const existingResult = await docClient.send(existingCommand)
    if (existingResult.Items && existingResult.Items.length > 0) {
      console.log('Appointment already exists, skipping creation')
      return existingResult.Items[0] as Appointment
    }

    const item: Appointment = {
      id: newId,
      clientName,
      appointmentDate,
      status: status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: notes || [],
      contactInfo: contactInfo || {
        phone: null,
        email: null
      },
      appointmentDetails: appointmentDetails || {
        location: null,
        doctor: null,
        reason: null,
        time: null
      },
      personalInfo: personalInfo || {
        dob: null,
        gender: null,
        address: null
      }
    }

    // Add DynamoDB-specific fields
    const dbItem = {
      ...item,
      pk: `APPOINTMENT#${newId}`,
      sk: `CLIENT#${clientName}`,
      gsi1pk: `DATE#${appointmentDate}`,
      gsi1sk: `APPOINTMENT#${newId}`
    }

    const command = new PutCommand({
      TableName,
      Item: dbItem,
      // Add condition to prevent overwriting if item exists
      ConditionExpression: 'attribute_not_exists(pk) AND attribute_not_exists(sk)'
    })

    await docClient.send(command)
    console.log('Successfully created appointment')
    return item
  } catch (error: any) {
    // If the error is a condition check failure, the item already exists
    if (error.name === 'ConditionalCheckFailedException') {
      console.log('Appointment already exists (condition check)')
      // Fetch and return the existing appointment
      const existingCommand = new QueryCommand({
        TableName,
        KeyConditionExpression: 'pk = :pk AND sk = :sk',
        ExpressionAttributeValues: {
          ':pk': `APPOINTMENT#${appointment.id}`,
          ':sk': `CLIENT#${appointment.clientName}`
        }
      })
      const existingResult = await docClient.send(existingCommand)
      if (existingResult.Items && existingResult.Items.length > 0) {
        return existingResult.Items[0] as Appointment
      }
    }
    console.error('Error creating appointment in DynamoDB:', error)
    throw new Error('Failed to create appointment in database')
  }
}

export async function getAppointments(): Promise<Appointment[]> {
  const { docClient } = getClient()
  try {
    const command = new ScanCommand({
      TableName,
      Limit: 100
    })

    console.log('Scanning DynamoDB table:', JSON.stringify(command.input, null, 2))
    const response = await docClient.send(command)
    
    // Create a Map to deduplicate appointments using a composite key
    const appointmentMap = new Map()
    
    ;(response.Items || []).forEach(item => {
      // Extract the base ID without any prefixes
      const baseId = (item.id || '')
        .replace('APPOINTMENT#', '')
        .replace('APPT#', '')
      
      // Create a unique key combining base ID and client name
      const uniqueKey = `${baseId}:${item.clientName}`
      
      // Only add if we haven't seen this combination before or if this is a more recent update
      const existingItem = appointmentMap.get(uniqueKey)
      if (!existingItem || 
          (item.updatedAt && existingItem.updatedAt && 
           new Date(item.updatedAt) > new Date(existingItem.updatedAt))) {
        appointmentMap.set(uniqueKey, item)
      }
    })

    const appointments = Array.from(appointmentMap.values())
    console.log('Deduplicated appointments:', appointments)
    return appointments
  } catch (error) {
    console.error('Error fetching appointments from DynamoDB:', error)
    throw new Error('Failed to fetch appointments from database')
  }
}

export async function updateAppointment(id: string, updates: any): Promise<void> {
  console.log('Updating appointment:', { id, updates })
  const { docClient } = getClient()
  
  try {
    // Build update expression dynamically based on provided updates
    const updateExpressions: string[] = []
    const expressionAttributeNames: { [key: string]: string } = {}
    const expressionAttributeValues: { [key: string]: any } = {}

    // Handle each possible update field
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'pk' && key !== 'sk') {
        updateExpressions.push(`#${key} = :${key}`)
        expressionAttributeNames[`#${key}`] = key
        expressionAttributeValues[`:${key}`] = value
      }
    })

    // Always update the updatedAt timestamp
    updateExpressions.push('#updatedAt = :updatedAt')
    expressionAttributeNames['#updatedAt'] = 'updatedAt'
    expressionAttributeValues[':updatedAt'] = new Date().toISOString()

    const command = new UpdateCommand({
      TableName,
      Key: {
        pk: `APPOINTMENT#${id}`,
        sk: `CLIENT#${updates.clientName}`
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    })

    console.log('DynamoDB Update Command:', JSON.stringify(command.input, null, 2))
    await docClient.send(command)
    console.log('✅ Successfully updated appointment')
  } catch (error) {
    console.error('❌ Error updating appointment in DynamoDB:', error)
    throw new Error('Failed to update appointment in database')
  }
}

export async function deleteAppointment(id: string, clientName: string): Promise<void> {
  const { docClient } = getClient()
  try {
    // Clean the ID by removing any known prefixes
    const baseId = id
      .replace('APPOINTMENT#', '')
      .replace('APPT#', '')

    // Create an array of delete promises for different key combinations
    const deletePromises = [
      // Try with APPOINTMENT# prefix
      docClient.send(new DeleteCommand({
        TableName,
        Key: {
          pk: `APPOINTMENT#${baseId}`,
          sk: `CLIENT#${clientName}`
        }
      })),
      // Try with APPT# prefix
      docClient.send(new DeleteCommand({
        TableName,
        Key: {
          pk: `APPT#${baseId}`,
          sk: `CLIENT#${clientName}`
        }
      })),
      // Try without prefix
      docClient.send(new DeleteCommand({
        TableName,
        Key: {
          pk: baseId,
          sk: `CLIENT#${clientName}`
        }
      }))
    ]

    // Execute all delete attempts
    await Promise.allSettled(deletePromises)
    console.log('✅ Successfully deleted appointment')
  } catch (error) {
    console.error('❌ Error deleting appointment:', error)
    throw new Error('Failed to delete appointment from database')
  }
} 