#!/bin/bash

# Let's Encrypt SSL Setup Script for JuzBuild Background Processor
# Usage: ./setup-ssl.sh <domain> <email>
# Example: ./setup-ssl.sh api.example.com admin@example.com

set -e

DOMAIN="$1"
EMAIL="$2"

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "❌ Missing arguments"
    echo "Usage: $0 <domain> <email>"
    echo "Example: $0 api.example.com admin@example.com"
    exit 1
fi

echo "=========================================="
echo "🔒 Setting up SSL/TLS for $DOMAIN"
echo "=========================================="

# Update system
echo "📦 Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Nginx and Certbot
echo "📦 Installing Nginx and Certbot..."
sudo apt-get install -y nginx certbot python3-certbot-nginx

# Create webroot directory for Let's Encrypt validation
echo "📁 Creating webroot directory..."
sudo mkdir -p /var/www/html
sudo chown -R www-data:www-data /var/www/html

# Stop Nginx temporarily for certificate validation
echo "🛑 Stopping Nginx..."
sudo systemctl stop nginx || true

# Get SSL certificate from Let's Encrypt
echo "🔐 Getting SSL certificate from Let's Encrypt..."
sudo certbot certonly --webroot \
    -w /var/www/html \
    -d "$DOMAIN" \
    --non-interactive \
    --agree-tos \
    -m "$EMAIL" \
    --preferred-challenges http

# Wait a moment for files to be written
sleep 2

# Verify certificate was created
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ] && [ -f "/etc/letsencrypt/live/$DOMAIN/privkey.pem" ]; then
    echo "✅ SSL certificate successfully created!"
    echo "   Location: /etc/letsencrypt/live/$DOMAIN/"
else
    echo "⚠️  Checking alternate certificate location..."
    # Sometimes certbot creates in a different path
    if sudo test -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem"; then
        echo "✅ SSL certificate found (with sudo)"
        echo "   Location: /etc/letsencrypt/live/$DOMAIN/"
    else
        echo "❌ Failed to create SSL certificate"
        echo "   Expected location: /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
        echo "   Checking what was created..."
        sudo ls -la /etc/letsencrypt/live/ || true
        exit 1
    fi
fi

# Create Nginx configuration
echo "⚙️  Configuring Nginx..."
sudo tee /etc/nginx/sites-available/juzbuild-bg-processor > /dev/null <<EOF
upstream background_processor {
    server localhost:3001;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS configuration
server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://background_processor;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Long timeout for background jobs (5 minutes)
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://background_processor/health;
        access_log off;
        proxy_read_timeout 10s;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
EOF

# Enable the Nginx site
echo "🔗 Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/juzbuild-bg-processor /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "✅ Testing Nginx configuration..."
sudo nginx -t

# Start Nginx
echo "🚀 Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Setup auto-renewal for certificates
echo "⏰ Setting up certificate auto-renewal..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test auto-renewal (dry run)
echo "🧪 Testing certificate renewal (dry run)..."
sudo certbot renew --dry-run

# Verify everything is working
echo ""
echo "=========================================="
echo "✅ SSL/TLS Setup Complete!"
echo "=========================================="
echo ""
echo "📝 Certificate Details:"
echo "   Domain: $DOMAIN"
echo "   Path: /etc/letsencrypt/live/$DOMAIN/"
echo "   Renewal: Auto-renewal enabled (every 90 days)"
echo ""
echo "🌐 URLs:"
echo "   HTTP:  http://$DOMAIN → redirects to HTTPS"
echo "   HTTPS: https://$DOMAIN"
echo ""
echo "🔍 Test your setup:"
echo "   curl https://$DOMAIN/health"
echo ""
echo "📊 Monitor certificate expiration:"
echo "   sudo certbot certificates"
echo ""
echo "🔄 Manual renewal:"
echo "   sudo certbot renew"
echo ""
