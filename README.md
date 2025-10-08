# JuzBuild Background Processor

This is the background processor service for JuzBuild that handles long-running website creation workflows separately from the main application.

## Overview

The background processor was separated from the main JuzBuild application to:

1. **Improve User Experience**: Website creation no longer blocks the main application
2. **Handle Long-Running Tasks**: GitHub uploads and deployments can take several minutes
3. **Better Resource Management**: Heavy processing is isolated from the user-facing application
4. **Scalability**: Can be deployed separately and scaled independently

## Architecture

```
┌─────────────────┐    HTTP Request    ┌──────────────────────┐
│   Main JuzBuild │ ──────────────────► │ Background Processor │
│   Application   │                     │                      │
│   (Port 3000)   │ ◄────────────────── │    (Port 3001)       │
└─────────────────┘    Job Queued       └──────────────────────┘
                                                    │
                                                    ▼
                                        ┌──────────────────────┐
                                        │   Website Creation   │
                                        │      Workflow        │
                                        │                      │
                                        │ 1. Create Database   │
                                        │ 2. Generate Template │
                                        │ 3. Push to GitHub    │
                                        │ 4. Deploy to Vercel  │
                                        │ 5. Setup Domain      │
                                        │ 6. Send Notification │
                                        │ 7. Log to Database   │
                                        └──────────────────────┘
```

## Setup and Installation

### Prerequisites

- Node.js 18+
- MongoDB connection
- GitHub token
- Vercel token
- Email configuration

### Installation

1. **Navigate to the background processor directory**:

   ```bash
   cd juzbuild-background-processor
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy the `.env` file and update with your credentials:

   ```bash
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   GITHUB_TOKEN=your_github_token
   VERCEL_TOKEN=your_vercel_token
   EMAIL_HOST=your_email_host
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   BACKGROUND_PROCESSOR_SECRET=your_secret_key
   ```

4. **Build the project**:

   ```bash
   npm run build
   ```

5. **Start the server**:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## API Endpoints

### Health Check

```http
GET /health
```

Returns the health status of the background processor.

### Process Website Creation

```http
POST /process-website-creation
Headers:
  Content-Type: application/json
  x-processor-secret: your_secret_key

Body: {
  "userId": "string",
  "websiteName": "string",
  "userEmail": "string",
  "companyName": "string",
  "domainName": "string",
  "brandColors": ["#color1", "#color2"],
  "tagline": "string",
  "aboutSection": "string",
  "selectedTheme": "string",
  "layoutStyle": "string",
  "propertyTypes": ["type1", "type2"],
  "includedPages": ["page1", "page2"],
  "preferredContactMethod": ["method1", "method2"]
}
```

### Job Status (Future Enhancement)

```http
GET /job-status/:jobId
Headers:
  x-processor-secret: your_secret_key
```

## Workflow Steps

The background processor executes the following steps for each website creation request:

1. **Database Creation**: Creates a MongoDB database with initial collections and sample data
2. **Template Generation**: Copies and customizes the Homely template with user data
3. **GitHub Repository**: Creates a new GitHub repository and pushes the template files
4. **Vercel Deployment**: Deploys the website to Vercel and waits for completion
5. **Domain Setup**: Configures subdomain (placeholder implementation)
6. **Email Notification**: Sends completion email to the user
7. **Database Logging**: Logs the created site information
8. **Cleanup**: Removes temporary template files

## Templates

The background processor includes a copy of the `templates/homely` directory which contains:

- Complete Next.js real estate website template
- Components, pages, and API routes
- Sample data and configurations
- Responsive design and modern UI

## Integration with Main Application

The main JuzBuild application has been updated to:

1. **Send requests to background processor** instead of processing locally
2. **Return immediate response** to users indicating the job has been queued
3. **Provide health check endpoints** to monitor processor status
4. **Handle processor unavailability** gracefully

### Updated API Routes

- `POST /api/workflow/create-site`: Now queues jobs with background processor
- `GET /api/workflow/health`: Checks background processor health
- `GET /api/workflow/status/[jobId]`: Gets job status (future enhancement)

## Development vs Production

### Development

- Run both services locally on different ports
- Main app: `http://localhost:3000`
- Background processor: `http://localhost:3001`

### Production

- Deploy background processor as separate service
- Update `BACKGROUND_PROCESSOR_URL` environment variable
- Ensure network connectivity between services
- Consider using Redis for job queue management

## Security

- **Secret-based authentication**: All requests require `x-processor-secret` header
- **Environment isolation**: Sensitive credentials stored in environment variables
- **Input validation**: All incoming requests are validated using Zod schemas

## Monitoring and Logging

- **Structured logging**: All steps include timestamps and context
- **Health checks**: Endpoint available for monitoring systems
- **Error tracking**: Detailed error messages and stack traces
- **Job tracking**: Future enhancement for job status monitoring

## Scaling Considerations

For high-traffic scenarios, consider:

1. **Horizontal scaling**: Run multiple processor instances
2. **Load balancing**: Distribute requests across instances
3. **Queue management**: Use Redis or RabbitMQ for job queuing
4. **Database optimization**: Separate databases for different tenants
5. **Caching**: Cache templates and configurations

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change `PORT` in environment variables
2. **Missing dependencies**: Run `npm install` in processor directory
3. **Authentication errors**: Verify `BACKGROUND_PROCESSOR_SECRET` matches in both services
4. **GitHub/Vercel failures**: Check token permissions and rate limits
5. **Database connection**: Verify MongoDB URI and network connectivity

### Logs Location

- Development: Console output
- Production: Consider using PM2 or similar for log management

## Future Enhancements

1. **Job Queue System**: Implement Redis-based job queue
2. **Status Tracking**: Real-time job status updates
3. **Retry Logic**: Automatic retry for failed operations
4. **Metrics Collection**: Performance and success rate metrics
5. **Admin Dashboard**: Web interface for monitoring jobs
6. **Multi-tenant Support**: Separate processing for different clients
7. **Template Marketplace**: Support for multiple website templates

## Contributing

When making changes to the background processor:

1. Update both services if API changes
2. Test integration thoroughly
3. Update environment variables documentation
4. Consider backward compatibility
5. Update this README with new features

## License

Same license as the main JuzBuild application.
