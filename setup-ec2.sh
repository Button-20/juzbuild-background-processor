#!/bin/bash

# JuzBuild Background Processor - EC2 Ubuntu Setup
# Run this script on your EC2 instance to set up everything

set -e

echo "=========================================="
echo "JuzBuild Background Processor"
echo "EC2 Ubuntu Setup"
echo "=========================================="
echo ""

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
sudo apt-get install -y \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Start Docker
echo "▶️  Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group
echo "👤 Adding ubuntu user to docker group..."
sudo usermod -aG docker ubuntu
newgrp docker << EOF
  echo "✅ Docker group activated"
EOF

# Install Docker Compose
echo "📋 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
echo "📚 Installing Git..."
sudo apt-get install -y git

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/juzbuild-background-processor
sudo chown -R ubuntu:ubuntu /opt/juzbuild-background-processor
cd /opt/juzbuild-background-processor

# Clone repository (will be updated by GitHub Actions)
echo "🔗 Cloning repository..."
if [ ! -d ".git" ]; then
  git clone https://github.com/Button-20/juzbuild-background-processor.git .
fi

# Create .env file template
echo "📝 Creating .env file template..."
if [ ! -f ".env" ]; then
  cat > .env << 'ENVEOF'
# MongoDB Configuration
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database

# Redis Configuration
REDIS_URL=redis://localhost:6379

# GitHub Configuration
GITHUB_TOKEN=your_github_token
GITHUB_USERNAME=your_github_username

# Vercel Configuration
VERCEL_TOKEN=your_vercel_token
VERCEL_TEAM_ID=your_team_id_optional

# Namecheap Configuration
NAMECHEAP_API_KEY=your_api_key
NAMECHEAP_USERNAME=your_username
NAMECHEAP_CLIENT_IP=your_ec2_static_ip
NAMECHEAP_SANDBOX=false

# Email Configuration
JUZBUILD_RESEND_API_KEY=your_resend_api_key
JUZBUILD_RESEND_FROM_EMAIL=info@yourdomain.com

# Background Processor Configuration
BACKGROUND_PROCESSOR_SECRET=your_secret_key
PORT=3001

# Analytics
GOOGLE_ANALYTICS_ACCOUNT_ID=your_analytics_id
ENVEOF
  
  echo "⚠️  IMPORTANT: Update .env file with your actual secrets!"
  echo "    nano /opt/juzbuild-background-processor/.env"
fi

# Create SSH directory for GitHub Actions
echo "🔑 Setting up SSH configuration..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh

echo ""
echo "=========================================="
echo "✅ Setup complete!"
echo "=========================================="
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Update your .env file:"
echo "   nano /opt/juzbuild-background-processor/.env"
echo ""
echo "2. Verify your configuration:"
echo "   cat /opt/juzbuild-background-processor/.env"
echo ""
echo "3. Go back to your local machine and:"
echo "   - Generate SSH key: ssh-keygen -t rsa -b 4096 -f ec2-github-actions -C 'github-actions' -N ''"
echo "   - Copy public key to this instance"
echo "   - Add GitHub Secrets (see setup guide)"
echo ""
echo "4. Push to GitHub to trigger deployment:"
echo "   git push origin master"
echo ""
echo "5. Monitor on GitHub:"
echo "   https://github.com/Button-20/juzbuild-background-processor/actions"
echo ""
echo "6. Check service on this instance:"
echo "   docker-compose logs -f"
echo ""
echo "=========================================="
