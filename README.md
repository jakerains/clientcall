# Client Call Management System

A Next.js application for managing medical appointments and automated patient confirmation calls using Bland AI and Amazon Bedrock.

## Features

- **Appointment Management**
  - Create, update, and delete appointments
  - View appointment details and history
  - Track appointment status
  - Store patient information and medical history
  - PDF document parsing and data extraction

- **Automated Calls**
  - Make automated confirmation calls using Bland AI
  - Real-time call status updates via SSE (Server-Sent Events)
  - Call result analysis and appointment status updates
  - Voicemail handling and call transcripts
  - Customizable call scripts and responses

- **Data Storage & Processing**
  - DynamoDB for persistent storage
  - AWS Secrets Manager for secure configuration
  - Real-time data synchronization
  - Amazon Bedrock for AI-powered document processing
  - Secure credential management

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- AWS Account with:
  - DynamoDB access
  - Bedrock access
  - Secrets Manager access
- Bland AI API key

## Configuration

The application uses AWS Secrets Manager to store configuration. Create a secret named `clientcalljr/env` with the following structure:

```json
{
  "AWS_ACCESS_KEY_ID": "your_aws_access_key",
  "AWS_SECRET_ACCESS_KEY": "your_aws_secret_key",
  "AWS_REGION": "your_aws_region",
  "DYNAMODB_TABLE_NAME": "your_table_name",
  "NEXT_PUBLIC_BLAND_API_KEY": "your_bland_ai_key",
  "NEXT_PUBLIC_BLAND_API": "https://api.bland.ai",
  "NEXT_PUBLIC_DOCUMENT_PROCESSOR_URL": "your_document_processor_url",
  "NEXT_PUBLIC_APP_URL": "your_app_url",
  "NEXT_PUBLIC_WEBHOOK_URL": "your_webhook_url"
}
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jakerains/clientcall.git
cd clientcall
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Project Structure

```
/
├── app/                    # Next.js 13+ app router pages and API routes
│   ├── api/               # API routes for appointments, webhooks, etc.
│   └── layout.tsx         # Root layout with providers
├── components/            # Reusable React components
├── contexts/              # React context providers
├── lib/                   # Utility functions and services
│   ├── dynamodb.ts       # DynamoDB operations
│   ├── blandApi.ts       # Bland AI integration
│   ├── secretsManager.ts # AWS Secrets Manager integration
│   └── documentParser.ts  # PDF parsing utilities
├── types/                 # TypeScript type definitions
├── docs/                  # Project documentation
└── public/               # Static assets
```

## API Routes

- `POST /api/appointments` - Create new appointment
- `GET /api/appointments` - List all appointments
- `PUT /api/appointments` - Update appointment
- `DELETE /api/appointments` - Delete appointment
- `DELETE /api/appointments/delete-all` - Delete all appointments
- `GET /api/bland-webhook` - SSE endpoint for call updates
- `POST /api/bland-webhook` - Webhook endpoint for Bland AI callbacks
- `POST /api/process-document` - Process and extract data from PDF documents
- `GET /api/config` - Retrieve public configuration values

## Database Schema

DynamoDB uses a composite key structure:
- Primary Key:
  - Partition Key (PK): `APPOINTMENT#${id}`
  - Sort Key (SK): `CLIENT#${clientName}`
- GSI1 (Global Secondary Index):
  - Partition Key: `DATE#${appointmentDate}`
  - Sort Key: `APPOINTMENT#${id}`

## Development

### Git Configuration
The repository includes a comprehensive `.gitignore` file that excludes:
- Development environment files
- Build artifacts
- Sensitive credentials
- IDE-specific files
- Temporary files and logs

### Scripts
```bash
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm start         # Start production server
pnpm lint          # Run linting
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
