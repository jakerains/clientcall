import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, ScanCommand, DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { Appointment } from '@/types/appointment'
import { getSecrets } from './secretsManager'

// Initialize DynamoDB client lazily
let client: DynamoDBClient | null = null
let docClient: DynamoDBDocumentClient | null = null

async function getClient() {
  if (!client || !docClient) {
    // Get credentials from Secrets Manager
    const secrets = await getSecrets()
    
    client = new DynamoDBClient({
      region: secrets.AWS_REGION,
      credentials: {
        accessKeyId: secrets.AWS_ACCESS_KEY_ID,
        secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY
      }
    })
    docClient = DynamoDBDocumentClient.from(client)
  }
  
  return { client, docClient }
}

// Get table name from Secrets Manager
async function getTableName() {
  const secrets = await getSecrets()
  return secrets.DYNAMODB_TABLE_NAME
}

export async function ensureTableExists(): Promise<void> {
  const { client } = await getClient()
  const TableName = await getTableName()
  
  try {
    // Check if table exists
    await client.send(new DescribeTableCommand({ TableName }))
    console.log('Table exists:', TableName)
  } catch (error) {
    if ((error as any).name === 'ResourceNotFoundException') {
      console.log('Table not found, creating:', TableName)
      
      // Create the table
      const createTableCommand = new CreateTableCommand({
        TableName,
        AttributeDefinitions: [
          { AttributeName: 'pk', AttributeType: 'S' },
          { AttributeName: 'sk', AttributeType: 'S' },
        ],
        KeySchema: [
          { AttributeName: 'pk', KeyType: 'HASH' },
          { AttributeName: 'sk', KeyType: 'RANGE' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
      })

      await client.send(createTableCommand)
      console.log('Table created successfully')
      
      // Wait for table to be active
      let tableActive = false
      while (!tableActive) {
        const { Table } = await client.send(new DescribeTableCommand({ TableName }))
        tableActive = Table?.TableStatus === 'ACTIVE'
        if (!tableActive) {
          console.log('Waiting for table to be active...')
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    } else {
      throw error
    }
  }
}

export async function createAppointment(appointment: Appointment): Promise<Appointment> {
  console.log('Creating appointment in DynamoDB:', appointment)
  const { docClient } = await getClient()
  
  try {
    // Use existing id if provided, otherwise generate new one
    const newId = appointment.id || `appt_${Date.now()}`
    const { clientName, appointmentDate, status, notes, appointmentDetails, personalInfo, contactInfo, ...rest } = appointment
    
    // Check if appointment already exists
    const existingCommand = new QueryCommand({
      TableName: await getTableName(),
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
      TableName: await getTableName(),
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
        TableName: await getTableName(),
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
  const { docClient } = await getClient()
  try {
    const command = new ScanCommand({
      TableName: await getTableName(),
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
  const { docClient } = await getClient()
  
  try {
    // Build update expression dynamically based on provided updates
    const updateExpressions: string[] = []
    const expressionAttributeNames: { [key: string]: string } = {}
    const expressionAttributeValues: { [key: string]: any } = {}

    // Handle each possible update field
    Object.entries(updates).forEach(([key, value]) => {
      // Skip undefined values and reserved DynamoDB keys
      if (value !== undefined && !['pk', 'sk', 'gsi1pk', 'gsi1sk'].includes(key)) {
        updateExpressions.push(`#${key} = :${key}`)
        expressionAttributeNames[`#${key}`] = key
        expressionAttributeValues[`:${key}`] = value
      }
    })

    // Always update the updatedAt timestamp
    updateExpressions.push('#updatedAt = :updatedAt')
    expressionAttributeNames['#updatedAt'] = 'updatedAt'
    expressionAttributeValues[':updatedAt'] = new Date().toISOString()

    // First, try to find the existing record
    const baseId = id.replace('APPOINTMENT#', '').replace('APPT#', '')
    const clientName = updates.clientName || ''
    
    // Check all possible key combinations
    const possibleKeys = [
      { pk: `APPOINTMENT#${baseId}`, sk: `CLIENT#${clientName}` },
      { pk: `APPT#${baseId}`, sk: `CLIENT#${clientName}` },
      { pk: baseId, sk: `CLIENT#${clientName}` }
    ]

    let existingRecord = null
    for (const key of possibleKeys) {
      try {
        const getResult = await docClient.send(new GetCommand({
          TableName: await getTableName(),
          Key: key
        }))
        if (getResult.Item) {
          existingRecord = { ...getResult.Item, keyUsed: key }
          break
        }
      } catch (error) {
        console.log(`No record found with key:`, key)
      }
    }

    if (!existingRecord) {
      console.log('No existing record found, using default key combination')
      // Use the APPOINTMENT# prefix as default if no existing record found
      existingRecord = { keyUsed: { pk: `APPOINTMENT#${baseId}`, sk: `CLIENT#${clientName}` } }
    }

    // Update using only the key combination that was found or the default
    const updateCommand = new UpdateCommand({
      TableName: await getTableName(),
      Key: existingRecord.keyUsed,
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    })

    await docClient.send(updateCommand)
    console.log('✅ Successfully updated appointment using key:', existingRecord.keyUsed)
  } catch (error) {
    console.error('❌ Error updating appointment in DynamoDB:', error)
    throw new Error('Failed to update appointment in database')
  }
}

export async function deleteAppointment(id: string, clientName: string): Promise<void> {
  const { docClient } = await getClient()
  try {
    // Clean the ID by removing any known prefixes
    const baseId = id
      .replace('APPOINTMENT#', '')
      .replace('APPT#', '')

    // Create an array of delete promises for different key combinations
    const deletePromises = [
      // Try with APPOINTMENT# prefix
      docClient.send(new DeleteCommand({
        TableName: await getTableName(),
        Key: {
          pk: `APPOINTMENT#${baseId}`,
          sk: `CLIENT#${clientName}`
        }
      })),
      // Try with APPT# prefix
      docClient.send(new DeleteCommand({
        TableName: await getTableName(),
        Key: {
          pk: `APPT#${baseId}`,
          sk: `CLIENT#${clientName}`
        }
      })),
      // Try without prefix
      docClient.send(new DeleteCommand({
        TableName: await getTableName(),
        Key: {
          pk: baseId,
          sk: `CLIENT#${clientName}`
        }
      })),
      // Try with just the raw ID and client name
      docClient.send(new DeleteCommand({
        TableName: await getTableName(),
        Key: {
          pk: baseId,
          sk: clientName
        }
      })),
      // Try with just the ID as both keys
      docClient.send(new DeleteCommand({
        TableName: await getTableName(),
        Key: {
          pk: baseId,
          sk: baseId
        }
      }))
    ]

    // Execute all delete attempts and ignore errors
    const results = await Promise.allSettled(deletePromises)
    const successfulDeletes = results.filter(r => r.status === 'fulfilled')
    
    if (successfulDeletes.length === 0) {
      console.warn('No successful deletes, but continuing anyway')
    }
    
    console.log('✅ Successfully processed delete request')
  } catch (error) {
    console.error('❌ Error deleting appointment:', error)
    throw new Error('Failed to delete appointment from database')
  }
} 