import { NextResponse } from 'next/server'
import { DynamoDBClient, ScanCommand, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb"
import { ensureTableExists } from '@/lib/dynamodb'

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

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export async function DELETE() {
  try {
    // Ensure table exists before any operations
    await ensureTableExists()
    
    // First, scan to get all appointment IDs
    const scanCommand = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      ProjectionExpression: "pk, sk"  // Get both primary key components
    })

    const scanResult = await client.send(scanCommand)
    
    if (!scanResult.Items?.length) {
      return NextResponse.json({ message: 'No appointments to delete' })
    }

    // DynamoDB BatchWrite can only handle 25 items at a time
    const chunks = []
    for (let i = 0; i < scanResult.Items.length; i += 25) {
      chunks.push(scanResult.Items.slice(i, i + 25))
    }

    // Delete all appointments in chunks
    for (const chunk of chunks) {
      const deleteRequests = chunk.map(item => ({
        DeleteRequest: {
          Key: {
            pk: item.pk,
            sk: item.sk
          }
        }
      }))

      const batchWriteCommand = new BatchWriteItemCommand({
        RequestItems: {
          [process.env.DYNAMODB_TABLE_NAME!]: deleteRequests
        }
      })

      await client.send(batchWriteCommand)
    }

    return NextResponse.json({ 
      message: `Successfully deleted ${scanResult.Items.length} appointments` 
    })

  } catch (error) {
    console.error('Error deleting all appointments:', error)
    return NextResponse.json(
      { error: 'Failed to delete appointments' },
      { status: 500 }
    )
  }
} 