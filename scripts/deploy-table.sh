#!/bin/bash

# Set environment variable if not provided
ENVIRONMENT=${1:-dev}

# Deploy the CloudFormation stack
aws cloudformation deploy \
  --template-file aws/appointments-table.yaml \
  --stack-name jr-clientcall-appointments-$ENVIRONMENT \
  --parameter-overrides Environment=$ENVIRONMENT \
  --capabilities CAPABILITY_IAM

# Get the table name from the stack outputs
TABLE_NAME=$(aws cloudformation describe-stacks \
  --stack-name jr-clientcall-appointments-$ENVIRONMENT \
  --query 'Stacks[0].Outputs[?OutputKey==`TableName`].OutputValue' \
  --output text)

echo "DynamoDB table '$TABLE_NAME' has been deployed"
echo "Please update your .env.local file with:"
echo "DYNAMODB_TABLE_NAME=$TABLE_NAME" 