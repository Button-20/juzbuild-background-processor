#!/bin/bash

# Quick start script for EC2 deployment
# Usage: bash setup-ec2-github-actions.sh

set -e

echo "=========================================="
echo "GitHub Actions + EC2 Setup"
echo "=========================================="

# Check if running on EC2
if ! ec2-metadata &>/dev/null; then
  echo "⚠️  Warning: This script should be run on EC2 instance"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Update system
echo "📦 Updating system packages..."
sudo yum update -y

# Install Docker if not present
if ! command -v docker &> /dev/null; then
  echo "🐳 Installing Docker..."
  sudo yum install docker -y
  sudo systemctl start docker
  sudo systemctl enable docker
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
  echo "📋 Installing Docker Compose..."
  sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
fi

# Install git if not present
if ! command -v git &> /dev/null; then
  echo "📚 Installing Git..."
  sudo yum install git -y
fi

# Add current user to docker group
echo "👤 Adding user to docker group..."
sudo usermod -aG docker $USER
newgrp docker << EOF
echo "Docker group activated"
EOF

# Create application directory
echo "📁 Creating application directory..."
if [ ! -d "/opt/juzbuild-background-processor" ]; then
  sudo mkdir -p /opt
  cd /opt
  sudo git clone https://github.com/Button-20/juzbuild-background-processor.git
  sudo chown -R $USER:$USER juzbuild-background-processor
fi

cd /opt/juzbuild-background-processor

# Create .env file if not exists
if [ ! -f ".env" ]; then
  echo "📝 Creating .env file..."
  cat > .env << 'EOF'
# MongoDB Configuration
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/Juzbuild

# GitHub Configuration
GITHUB_TOKEN=your_github_token
GITHUB_USERNAME=your_github_username

# Vercel Configuration
VERCEL_TOKEN=your_vercel_token
VERCEL_TEAM_ID=your_team_id

# Namecheap Configuration
NAMECHEAP_API_KEY=your_api_key
NAMECHEAP_USERNAME=your_username
NAMECHEAP_CLIENT_IP=your_ec2_ip
NAMECHEAP_SANDBOX=false

# Email Configuration
JUZBUILD_RESEND_API_KEY=your_resend_api_key
JUZBUILD_RESEND_FROM_EMAIL=info@yourdomain.com

# Background Processor Configuration
BACKGROUND_PROCESSOR_SECRET=your_secret_here
PORT=3001

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Analytics
GOOGLE_ANALYTICS_ACCOUNT_ID=your_analytics_id
EOF
  echo "⚠️  Please update .env file with your actual secrets:"
  echo "    nano /opt/juzbuild-background-processor/.env"
fi

# Create certs directory for nginx
mkdir -p /opt/juzbuild-background-processor/certs

# Generate SSH directory for actions if needed
mkdir -p ~/.ssh
chmod 700 ~/.ssh

echo ""
echo "=========================================="
echo "✅ Setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Update your .env file with actual secrets:"
echo "   nano /opt/juzbuild-background-processor/.env"
echo ""
echo "2. On your local machine, generate GitHub Actions SSH key:"
echo "   ssh-keygen -t rsa -b 4096 -f ec2-github-actions -C 'github-actions' -N ''"
echo ""
echo "3. Add the public key to EC2:"
echo "   cat ec2-github-actions.pub >> ~/.ssh/authorized_keys"
echo ""
echo "4. Add GitHub Secrets:"
echo "   - EC2_PRIVATE_KEY: Contents of ec2-github-actions"
echo "   - EC2_USER: ubuntu"
echo "   - EC2_HOST: your-ec2-ip"
echo ""
echo "5. Push to GitHub to trigger deployment:"
echo "   git push origin master"
echo ""
echo "6. Monitor deployment:"
echo "   - GitHub Actions tab: https://github.com/Button-20/juzbuild-background-processor/actions"
echo "   - EC2 logs: docker-compose logs -f"
echo ""
echo "7. Verify service is running:"
echo "   curl http://localhost:3001/health"
echo ""
echo "=========================================="
