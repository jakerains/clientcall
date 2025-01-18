import { GlobalWorkerOptions } from 'pdfjs-dist'

let isInitialized = false

export async function initPDFWorker() {
  // Only run in browser context
  if (typeof window === 'undefined') {
    return
  }

  // Prevent multiple initializations
  if (isInitialized) {
    return
  }

  try {
    // Set worker source to the public file
    GlobalWorkerOptions.workerSrc = '/pdf.worker.js'
    isInitialized = true
  } catch (error) {
    console.error('Failed to initialize PDF.js worker:', error)
    throw new Error('PDF processing initialization failed')
  }
} 