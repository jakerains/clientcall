const fs = require('fs')
const path = require('path')

// Source path of the PDF.js worker file
const workerPath = path.join(
  __dirname,
  '../node_modules/pdfjs-dist/build/pdf.worker.mjs'
)

// Destination path in the public directory
const destPath = path.join(__dirname, '../public/pdf.worker.mjs')

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// Copy the worker file
try {
  fs.copyFileSync(workerPath, destPath)
  console.log('PDF.js worker file copied to public directory from:', workerPath)
} catch (error) {
  console.error('Error copying PDF.js worker file:', error)
  process.exit(1)
} 