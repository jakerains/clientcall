# Project Map

## Core Components

### State Management
- `contexts/appointments.tsx`: Global state management for appointments
  - AppointmentsProvider: Context provider component
  - useAppointments: Custom hook for accessing appointment data
  - Manages list of parsed appointments
  - Provides functions for CRUD operations on appointments

### Document Processing
- `app/api/process-document/route.ts`: PDF processing and data extraction
  - Uses Amazon Bedrock (Nova model) for intelligent data extraction
  - Processes medical forms and appointment documents
  - Extracts structured data including:
    - Client information
    - Contact details
    - Appointment specifics
    - Medical history
  - Handles validation and error checking

### Database Integration
- `lib/dynamodb.ts`: DynamoDB operations and data management
  - Table structure:
    - Primary Key: `APPOINTMENT#${id}` (PK), `CLIENT#${clientName}` (SK)
    - GSI1: `DATE#${appointmentDate}` (PK), `APPOINTMENT#${id}` (SK)
  - Implements CRUD operations
  - Handles data deduplication
  - Manages composite keys and indexes

### Call Management
- `lib/blandApi.ts`: Bland AI integration
  - Handles outbound calls
  - Manages call status updates
  - Processes call transcripts
  - Updates appointment statuses

### UI Components
- `components/upload-section.tsx`: File upload and processing
  - PDF document upload
  - Data extraction preview
  - Confirmation dialog
- `components/appointments-table.tsx`: Appointment management
  - List view of appointments
  - Status updates
  - Call initiation
- `components/client-details-sheet.tsx`: Client information
  - Detailed view of appointments
  - Edit functionality
  - Contact information display

### API Routes
- `app/api/appointments/route.ts`: Appointment management endpoints
  - CRUD operations
  - Batch operations
  - Status updates
- `app/api/bland-webhook/route.ts`: Call status management
  - SSE for real-time updates
  - Webhook processing
  - Call result analysis

### Configuration
- `next.config.js`: Next.js configuration
- `.env.local`: Environment variables
  - AWS credentials
  - DynamoDB settings
  - Bland AI configuration
- `.gitignore`: Version control exclusions
  - Development files
  - Environment variables
  - Build artifacts
  - IDE files
  - Logs and temporary files

## Implementation Details

### Security
- Environment variable management
- AWS IAM integration
- API key handling
- Webhook authentication

### Data Flow
1. Document Upload
   - PDF upload → Nova processing → Data extraction → Preview
2. Appointment Creation
   - Confirmation → DynamoDB storage → UI update
3. Call Management
   - Initiation → Bland AI → Webhook updates → Status changes

### Error Handling
- Input validation
- API error responses
- Database operation fallbacks
- Call failure recovery

### Testing
- Webhook testing utilities
- DynamoDB operation tests
- PDF processing validation
- Call simulation tools 