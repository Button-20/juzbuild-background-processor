#!/bin/bash

# JuzBuild Background Processor - EC2 Deployment Script
# Run this on your EC2 instance to set up the Docker container

set -e

echo "=========================================="
echo "JuzBuild Background Processor - EC2 Setup"
echo "=========================================="

# Update system
echo "Updating system packages..."
sudo yum update -y

# Install Docker
echo "Installing Docker..."
sudo yum install docker -y

# Start Docker service
echo "Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group (optional, allows running without sudo)
echo "Adding user to docker group..."
sudo usermod -aG docker $USER

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
echo "Cloning repository..."
cd /opt || mkdir -p /opt && cd /opt
sudo git clone https://github.com/Button-20/juzbuild-background-processor.git
cd juzbuild-background-processor
sudo chown -R $USER:$USER .

echo ""
echo "=========================================="
echo "✅ Docker installed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Create .env file with your secrets:"
echo "   nano .env"
echo ""
echo "2. Copy these environment variables into .env:"
cat << 'EOF'
# MongoDB Configuration
MONGODB_URI=your_mongodb_uri_here

# GitHub Configuration
GITHUB_TOKEN=your_github_token_here
GITHUB_USERNAME=your_github_username_here

# Vercel Configuration
VERCEL_TOKEN=your_vercel_token_here
VERCEL_TEAM_ID=your_team_id_here_if_using_team

# Namecheap Configuration
NAMECHEAP_API_KEY=your_namecheap_api_key_here
NAMECHEAP_USERNAME=your_namecheap_username_here
NAMECHEAP_CLIENT_IP=your_ec2_static_ip_here
NAMECHEAP_SANDBOX=false

# Email Configuration
JUZBUILD_RESEND_API_KEY=your_resend_api_key_here
JUZBUILD_RESEND_FROM_EMAIL=your_from_email_here

# Background Processor Configuration
BACKGROUND_PROCESSOR_SECRET=your_secret_here
PORT=3001

# Redis Configuration
REDIS_URL=your_redis_url_here

# Analytics
GOOGLE_ANALYTICS_ACCOUNT_ID=your_analytics_id_here
EOF
echo ""
echo "3. Build and run with Docker Compose:"
echo "   docker-compose up -d"
echo ""
echo "4. Verify the service is running:"
echo "   curl http://localhost:3001/health"
echo ""
echo "5. View logs:"
echo "   docker-compose logs -f"
echo ""
echo "=========================================="
