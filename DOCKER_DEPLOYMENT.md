# Docker Deployment Guide - JuzBuild Background Processor

This guide explains how to run the JuzBuild Background Processor in Docker on your EC2 instance with a static IP.

## Prerequisites

- Docker installed
- Docker Compose installed
- `.env` file with all required environment variables
- EC2 instance with a static IP (elastic IP)
- SSH access to your EC2 instance

## Quick Start - Local Development

### Option 1: Using docker-compose (Recommended)

```bash
# Build and run the service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

### Option 2: Manual Docker Commands

```bash
# Build the image
npm run docker:build

# Run the container
npm run docker:run

# Access the service
curl http://localhost:3001/health
```

## EC2 Deployment

### Step 1: Automated Setup (Recommended)

Copy and run the deployment script on your EC2 instance:

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-public-ip

# Run the deployment script
bash <(curl -s https://raw.githubusercontent.com/Button-20/juzbuild-background-processor/master/deploy-ec2.sh)
```

### Step 2: Manual Setup

If you prefer manual setup:

```bash
# Update system and install Docker
sudo yum update -y
sudo yum install docker -y

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Clone the repository
cd /opt
sudo git clone https://github.com/Button-20/juzbuild-background-processor.git
cd juzbuild-background-processor
sudo chown -R $USER:$USER .

# Create .env file with your secrets
nano .env
# Paste all environment variables

# Build and run
docker-compose up -d
```

### Step 3: Verify Deployment

```bash
# Check if container is running
docker-compose ps

# Test the health endpoint
curl http://localhost:3001/health

# View logs
docker-compose logs -f background-processor
```

## Environment Variables

Create a `.env` file with these variables:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database

# GitHub Configuration
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_USERNAME=your-github-username

# Vercel Configuration
VERCEL_TOKEN=your-vercel-token
VERCEL_TEAM_ID=team-id-if-using-team

# Namecheap Configuration
NAMECHEAP_API_KEY=your-api-key
NAMECHEAP_USERNAME=your-username
NAMECHEAP_CLIENT_IP=your-ec2-static-ip
NAMECHEAP_SANDBOX=false

# Email Configuration
JUZBUILD_RESEND_API_KEY=re_xxxxxxxxxxxx
JUZBUILD_RESEND_FROM_EMAIL=info@yourdomain.com

# Background Processor Configuration
BACKGROUND_PROCESSOR_SECRET=your-secret-here
PORT=3001

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Analytics
GOOGLE_ANALYTICS_ACCOUNT_ID=your-analytics-id
```

## Production Setup with Nginx (Optional)

For production with SSL/TLS:

```bash
# Use the production docker-compose file
docker-compose -f docker-compose.prod.yml up -d

# Generate SSL certificates (using Let's Encrypt)
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates to the certs directory
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./certs/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./certs/key.pem
sudo chown $USER:$USER ./certs/*

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

## Available API Endpoints

### Health Check
```bash
GET /health
```
Returns service status and Redis connection status.

### Process Website Creation
```bash
POST /process-website-creation
Content-Type: application/json

{
  "jobId": "unique-job-id",
  "websiteData": { ... }
}
```

### Job Status
```bash
GET /job-status/{jobId}
```
Returns the current status of a website creation job.

## Useful Docker Commands

```bash
# Build the image
docker build -t juzbuild-background-processor .

# Run with environment file
docker run -p 3001:3001 --env-file .env juzbuild-background-processor

# View running containers
docker ps

# View container logs
docker logs -f <container-id>

# Stop a container
docker stop <container-id>

# Remove unused images and containers
docker system prune

# Rebuild without cache
docker build --no-cache -t juzbuild-background-processor .
```

## Updating the Application

```bash
# Pull latest code
git pull origin master

# Rebuild the image
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Verify deployment
curl http://your-ec2-ip:3001/health
```

## Troubleshooting

### Container exits immediately
```bash
# Check logs
docker-compose logs background-processor

# Verify environment variables
docker-compose config
```

### Port already in use
```bash
# Find process using port 3001
lsof -i :3001

# Or change the port in docker-compose.yml
# Change "3001:3001" to "3002:3001"
```

### Health check failing
```bash
# Verify service is running
curl http://localhost:3001/health

# Check MongoDB connection
curl http://localhost:3001/health | jq '.mongodb'

# Check Redis connection
curl http://localhost:3001/health | jq '.redis'
```

### Need to restart a service
```bash
# Restart background processor
docker-compose restart background-processor

# Restart all services
docker-compose restart

# Restart with rebuild
docker-compose up -d --build
```

## Monitoring

### Check resource usage
```bash
docker stats
```

### Check for errors
```bash
docker-compose logs --tail=100 background-processor
```

### Monitor in real-time
```bash
watch -n 5 'docker stats --no-stream'
```

## Integration with Main JuzBuild App

Update your main JuzBuild app's `.env.local`:

```bash
BACKGROUND_PROCESSOR_URL=http://your-ec2-static-ip:3001
BACKGROUND_PROCESSOR_SECRET=your-secret-here
```

The main app will now send website creation requests to your EC2-hosted background processor.

## Scaling

To run multiple instances of the background processor:

```bash
# Scale to 3 instances
docker-compose up -d --scale background-processor=3

# Use a load balancer (nginx) to distribute traffic
# Update nginx.conf to use upstream with multiple servers
```

## Support

For issues or questions, check:
1. Container logs: `docker-compose logs -f`
2. Health endpoint: `curl http://localhost:3001/health`
3. GitHub Issues: https://github.com/Button-20/juzbuild-background-processor/issues
