# Changelog

## [Unreleased]

### Added
- Enhanced `.gitignore` configuration with comprehensive exclusions
  - Added IDE and editor files
  - Added AWS credentials and config files
  - Added additional log files
  - Added runtime data files
  - Added test coverage directories
  - Added build output directories
  - Added temporary files and caches
- Added Amazon Bedrock Nova model integration for document processing
- Added proper error handling for contact information extraction
- Added comprehensive documentation updates
  - Updated README with current configuration
  - Updated project map with detailed architecture
  - Added testing documentation
  - Added security considerations

### Changed
- Updated DynamoDB key structure for better data organization
  - Primary Key: APPOINTMENT#${id} (PK), CLIENT#${clientName} (SK)
  - GSI1: DATE#${appointmentDate} (PK), APPOINTMENT#${id} (SK)
- Modified appointment creation to include contact information
- Enhanced PDF extraction with Nova model configuration
  - Adjusted temperature settings for better accuracy
  - Updated extraction prompts for contact information
  - Improved field mapping and validation
- Updated webhook handling for better error recovery
- Improved documentation structure and organization

### Fixed
- Fixed contact information not being saved in DynamoDB
- Fixed appointment updates not preserving all fields
- Fixed PDF extraction accuracy issues
- Fixed webhook error handling
- Fixed environment variable documentation

### Removed
- Removed redundant environment variables
- Cleaned up unused configuration files
- Removed outdated documentation

## [1.0.0] - 2024-01-18

Initial release with core functionality:
- PDF document processing
- Appointment management
- Automated calls with Bland AI
- DynamoDB integration
- Real-time updates via webhooks 