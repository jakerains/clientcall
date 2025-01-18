# Install node-fetch if not already installed
Write-Host "🔧 Installing dependencies..."
npm install --save-dev node-fetch@2 @types/node-fetch concurrently wait-on

# Start Next.js server and run tests
Write-Host "🚀 Starting Next.js server and running tests..."
npx concurrently `
  "npm run dev" `
  "npx wait-on tcp:3000 tcp:3001 && npx ts-node scripts/test-webhook.ts"