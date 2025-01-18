# Set environment variable if not provided
param(
    [string]$Environment = "dev"
)

Write-Host "Deploying DynamoDB table for environment: $Environment"

# Deploy the CloudFormation stack
aws cloudformation deploy `
    --template-file aws/appointments-table.yaml `
    --stack-name "jr-clientcall-appointments-$Environment" `
    --parameter-overrides "Environment=$Environment" `
    --capabilities CAPABILITY_IAM

if ($LASTEXITCODE -eq 0) {
    # Get the table name from the stack outputs
    $TABLE_NAME = aws cloudformation describe-stacks `
        --stack-name "jr-clientcall-appointments-$Environment" `
        --query 'Stacks[0].Outputs[?OutputKey==`TableName`].OutputValue' `
        --output text

    Write-Host "`nDynamoDB table '$TABLE_NAME' has been deployed"
    Write-Host "Please verify this matches your .env.local file:"
    Write-Host "DYNAMODB_TABLE_NAME=$TABLE_NAME"
} else {
    Write-Host "Failed to deploy CloudFormation stack" -ForegroundColor Red
} 