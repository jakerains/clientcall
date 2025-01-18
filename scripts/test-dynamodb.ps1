# Install required dependencies if not present
Write-Host "📦 Checking dependencies..."
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Host "Installing npx..."
    npm install -g npx
}

if (-not (Test-Path node_modules/ts-node)) {
    Write-Host "Installing ts-node..."
    npm install --save-dev ts-node @types/node
}

if (-not (Test-Path node_modules/dotenv)) {
    Write-Host "Installing dotenv..."
    npm install dotenv
}

# Compile and run the TypeScript test file
Write-Host "🔨 Compiling and running DynamoDB tests..."
npx ts-node scripts/test-dynamodb.ts

# Check the exit code
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Tests completed successfully!"
} else {
    Write-Host "❌ Tests failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
} 