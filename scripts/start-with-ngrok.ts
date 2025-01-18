import ngrok from 'ngrok'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

const alienArt = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠤⠐⠒⠂⠤⢄⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⡠⠖⠁⠀⠀⠀⠀⠀⠁⠢⡈⠲⣄⠀⠀
⠀⠀⠀⠀⠀⡜⠁⠀⢀⠁⠀⠀⠈⢁⠀⠔⠀⠄⠈⢦⠀
⠀⠀⠀⠀⠀⠁⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠈⡄
⠀⠀⠀⠀⠀⣦⡇⠀⠀⠀⠀⡀⡀⠀⠀⠀⠀⠀⢸⣴⠁
⠀⠀⠀⠀⠀⢹⡧⠄⠀⠀⢉⠐⠒⠀⡉⠁⠀⠢⢼⡇⠀
⠀⠀⠀⠀⠀⢸⢸⣟⠛⣿⣦⠑⠀⠊⣴⠿⣿⣿⡏⡇⠀
⠀⠀⠀⠀⠀⠘⢮⢻⣿⣿⣿⡇⠀⢸⣿⣾⣿⣟⡴⠁⠀
⡤⠄⠀⡖⢢⠀⠈⢳⡈⠙⠛⢁⠀⡈⠛⠋⣁⡞⠁⠀⠀
⠱⡸⡀⡕⡎⠀⠀⠀⠳⣄⠀⠉⠀⠉⠀⣠⠟⠀⠀⠀⠀
⠀⢣⢣⡇⡇⠀⠀⠀⠀⠈⢧⡀⠒⢈⡼⠁⠀⠀⠀⠀⠀
⢴⢺⣃⡒⠣⡀⠀⠀⠀⠀⠸⣿⠲⣿⠇⠀⠀⠀⠀⠀⠀
⠈⠣⡹⠉⢀⠃⠀⢀⣀⡠⠜⡙⣀⢛⠣⢄⣀⡀⠀⠀⠀
⠀⠀⠑⡏⣹⠀⢸⠇⢀⠀⠉⠀⣀⠀⠁⠀⡄⠸⡆⠀⠀
⠀⠀⠀⢁⠀⢇⡸⢀⣨⡀⠀⠀⢀⠀⠀⢀⣅⠀⡇⠀⠀
⠀⠀⠀⠸⡀⠈⠇⣸⠏⣇⠀⠀⠤⠀⠀⣸⡇⠀⠀⠀⠀
⠀⠀⠀⠀⣿⡀⢨⡟⠀⡗⠀⠀⢀⠀⠀⢺⡇⠀⠇⠀⠀
⠀⠀⠀⠀⠈⠺⡽⠁⠀⠧⠬⠤⠤⠄⠄⠸⢇⣄⠇⠀⠀
 Made with 💚 by GenAI Jake`

async function startNgrok() {
  try {
    // Display alien art
    console.log('\x1b[32m%s\x1b[0m', alienArt)  // Green color
    console.log('\n🚀 Starting Client Call Assistant...\n')

    // Load environment variables
    dotenv.config({ path: '.env.local' })
    
    // Configure ngrok options
    const ngrokConfig: any = {
      addr: process.env.PORT || 3000,
    }

    // Only use custom domain if explicitly requested with --custom-domain flag
    if (process.argv.includes('--custom-domain') && process.env.NGROK_AUTHTOKEN && process.env.NGROK_DOMAIN) {
      console.log('\n🔑 Using custom domain configuration')
      ngrokConfig.authtoken = process.env.NGROK_AUTHTOKEN
      ngrokConfig.hostname = process.env.NGROK_DOMAIN
      console.log(`🌐 Custom domain: ${process.env.NGROK_DOMAIN}`)
    } else {
      console.log('\n🔄 Using default ngrok configuration with random URL')
    }

    // Start ngrok
    console.log('\n🚀 Starting ngrok tunnel...')
    const url = await ngrok.connect(ngrokConfig)
    
    console.log(`
    ✨ Ngrok tunnel established!
    
    📡 URL: ${url}
    🔒 Protocol: ${url.startsWith('https') ? 'HTTPS (Secure)' : 'HTTP (Not Secure)'}
    `)

    // Update .env.local with the ngrok URL
    const envPath = path.join(process.cwd(), '.env.local')
    let envConfig: any = {}

    // Read existing env file if it exists
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf8')
      envConfig = dotenv.parse(envFile)
      console.log('\n📝 Current environment loaded')
    } else {
      console.log('\n⚠️ No .env.local file found, creating new one')
    }

    // Store the old URL for comparison
    const oldUrl = envConfig.NEXT_PUBLIC_APP_URL

    // Update the APP_URL
    envConfig.NEXT_PUBLIC_APP_URL = url
    envConfig.NEXT_PUBLIC_DOCUMENT_PROCESSOR_URL = `${url}/api/process-document`

    // Write back to .env.local
    const envContents = Object.entries(envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    fs.writeFileSync(envPath, envContents)

    console.log(`
    ✅ Environment updated:
    ${oldUrl ? `Previous URL: ${oldUrl}` : 'No previous URL set'}
    New URL: ${url}
    Document Processor URL: ${url}/api/process-document`)

    console.log(`
    🔔 Webhook Information: 
    1. Webhook URL will be: ${url}/api/bland-webhook
    2. This URL will be automatically used for Bland API calls
    3. Webhook events will update appointment status in real-time
    
    ⚡ Starting Next.js server...
    `)

    // Start Next.js server
    const nextDev = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    })

    // Handle cleanup
    const cleanup = async () => {
      console.log('\n🛑 Shutting down services...')
      await ngrok.kill()
      nextDev.kill()
      process.exit()
    }

    // Setup cleanup handlers
    process.on('SIGINT', cleanup)
    process.on('SIGTERM', cleanup)
    nextDev.on('close', cleanup)

    // Log inspection URL
    const inspectUrl = await ngrok.getUrl()
    if (inspectUrl) {
      console.log(`
      🔍 Ngrok Inspector:
      You can view tunnel status and incoming webhooks at: ${inspectUrl}
      `)
    }

  } catch (error) {
    console.error('❌ Error starting services:', error)
    await ngrok.kill()
    process.exit(1)
  }
}

// Check if running with custom domain flag
const useCustomDomain = process.argv.includes('--custom-domain')
if (useCustomDomain) {
  console.log('🌐 Starting with custom domain configuration...')
}

startNgrok() 