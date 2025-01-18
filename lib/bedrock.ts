import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime"

const REGION = process.env.AWS_REGION || "us-east-1"

// Create Bedrock client with direct credentials
const bedrockClient = new BedrockRuntimeClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
})

const SYSTEM_PROMPT = `You are an expert at extracting structured information from medical documents and appointment records.
Your task is to analyze the provided text and extract key information in a consistent format.
Focus on accuracy and completeness.

Required fields to extract:
- Client name
- Appointment date and time
- Contact information (phone, email)
- Personal information (DOB, gender, address)
- Medical history (allergies, conditions, medications)
- Appointment details (location, doctor, reason)
- Additional notes or remarks

Format requirements:
- Use consistent date formats (YYYY-MM-DD)
- Validate and format phone numbers consistently
- Validate email addresses
- Return null for missing fields
- Structure the response as a valid JSON object
- Return ONLY the JSON object, no additional text or markdown`

export async function processDocumentWithBedrock(text: string): Promise<any> {
  try {
    const messages = [
      {
        role: "user",
        content: [
          {
            text: `${SYSTEM_PROMPT}\n\nDocument text to analyze:\n${text}`
          }
        ]
      }
    ]

    const response = await bedrockClient.send(
      new InvokeModelCommand({
        modelId: "amazon.nova-micro-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({ messages })
      })
    )

    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    
    try {
      // Extract JSON from the response text
      const responseText = responseBody.output.message.content[0].text
      // Remove markdown code block if present
      const jsonText = responseText.replace(/```json\n|\n```/g, '')
      return JSON.parse(jsonText)
    } catch (error) {
      console.error("Failed to parse Nova Micro response as JSON:", error)
      throw new Error("Invalid response format from Nova Micro")
    }
  } catch (error: any) {
    console.error("Nova Micro processing error:", error)
    throw error
  }
}

