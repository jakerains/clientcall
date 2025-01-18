import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const REGION = process.env.AWS_REGION || "us-east-1";
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

console.log('Starting cleanup script...');
console.log('AWS Region:', REGION);
console.log('Table Name:', TABLE_NAME);

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('❌ AWS credentials not found in environment variables');
  process.exit(1);
}

if (!TABLE_NAME) {
  console.error('❌ DYNAMODB_TABLE_NAME not found in environment variables');
  process.exit(1);
}

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const docClient = DynamoDBDocumentClient.from(client);

async function clearTestData() {
  console.log('🧹 Clearing test data from DynamoDB...');

  try {
    console.log('Scanning table for items...');
    
    // Scan for all items
    const scanCommand = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "begins_with(pk, :pk)",
      ExpressionAttributeValues: {
        ":pk": "APPOINTMENT#"
      }
    });

    console.log('Executing scan command...');
    const response = await docClient.send(scanCommand);
    const items = response.Items || [];

    console.log(`Found ${items.length} items to delete`);

    if (items.length === 0) {
      console.log('No items found to delete');
      return;
    }

    // Delete each item
    for (const item of items) {
      console.log(`Deleting item: ${item.pk}`);
      
      const deleteCommand = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          pk: item.pk,
          sk: item.sk
        }
      });

      await docClient.send(deleteCommand);
      console.log(`Successfully deleted item: ${item.pk}`);
    }

    console.log('✅ Successfully cleared all test data');
  } catch (error) {
    console.error('❌ Error clearing test data:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    process.exit(1);
  }
}

// Run the cleanup
console.log('Starting cleanup process...');
clearTestData().then(() => {
  console.log('Cleanup process completed');
}).catch((error) => {
  console.error('Fatal error during cleanup:', error);
  process.exit(1);
}); 