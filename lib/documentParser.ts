import * as pdfjsLib from 'pdfjs-dist'
import { AppointmentData } from '@/types/appointments'

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs'
}

export async function extractAppointmentData(file: File): Promise<AppointmentData> {
  try {
    // Get text content from PDF
    const text = await extractTextFromPDF(file)
    console.log('Processing document text length:', text.length)
    
    // Use the same origin as the current page for the API endpoint
    const processingUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/api/process-document`
      : '/api/process-document'
    
    console.log('Using document processor URL:', processingUrl)

    // Send to server endpoint for processing
    console.log('Sending request to:', processingUrl)
    const response = await fetch(processingUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
      mode: 'cors',
      credentials: 'omit'
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      try {
        const errorData = JSON.parse(errorText)
        throw new Error(errorData.error || 'Failed to process document')
      } catch (e) {
        // If the error response is not JSON, throw the raw text
        throw new Error(`Document processing failed: ${errorText}`)
      }
    }

    try {
      const data = await response.json()
      console.log('Processed data:', data)
      return data
    } catch (e) {
      console.error('Error parsing response:', e)
      throw new Error('Invalid response format from document processor')
    }
  } catch (error) {
    console.error('Error parsing PDF:', error)
    if (error instanceof Error) {
      throw new Error(`PDF processing failed: ${error.message}`)
    }
    throw new Error('Failed to process PDF file')
  }
}

async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    console.log('PDF loaded as array buffer') // Debug log
    
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise
    console.log('PDF document loaded, pages:', pdf.numPages) // Debug log
    
    let fullText = ''

    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Processing page ${i}`) // Debug log
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n'
    }

    return fullText
  } catch (error) {
    console.error('Error in PDF text extraction:', error)
    throw new Error('Failed to extract text from PDF')
  }
} 