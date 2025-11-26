#!/bin/bash

# Configure Nginx for JuzBuild Background Processor
# Usage: ./configure-nginx.sh <domain>
# Example: ./configure-nginx.sh bgp.juzbuild.com

set -e

DOMAIN="$1"

if [ -z "$DOMAIN" ]; then
    echo "❌ Missing domain argument"
    echo "Usage: $0 <domain>"
    echo "Example: $0 bgp.juzbuild.com"
    exit 1
fi

echo "=========================================="
echo "⚙️  Configuring Nginx for $DOMAIN"
echo "=========================================="
echo ""

# Check if certificate exists
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "❌ Certificate not found for $DOMAIN"
    echo "   Expected: /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
    echo ""
    echo "   First run SSL setup:"
    echo "   ./setup-ssl.sh $DOMAIN your-email@example.com"
    exit 1
fi

echo "✅ Certificate found for $DOMAIN"
echo ""

# Copy Nginx config
echo "📋 Copying Nginx configuration..."
sudo cp nginx.conf /etc/nginx/sites-available/juzbuild-bg-processor

# Replace domain placeholder
echo "🔄 Updating domain in Nginx config..."
sudo sed -i "s/YOUR-DOMAIN.com/$DOMAIN/g" /etc/nginx/sites-available/juzbuild-bg-processor

# Enable the Nginx site
echo "🔗 Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/juzbuild-bg-processor /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "✅ Testing Nginx configuration..."
sudo nginx -t

if [ $? -ne 0 ]; then
    echo "❌ Nginx configuration test failed"
    echo "   Checking the configuration file..."
    sudo cat /etc/nginx/sites-available/juzbuild-bg-processor | grep -A 5 "ssl_certificate"
    exit 1
fi

echo ""

# Restart Nginx
echo "🚀 Restarting Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

echo ""
echo "=========================================="
echo "✅ Nginx Configuration Complete!"
echo "=========================================="
echo ""
echo "🌐 Your service is now available at:"
echo "   https://$DOMAIN"
echo "   https://$DOMAIN/health"
echo ""
echo "🧪 Test it:"
echo "   curl https://$DOMAIN/health"
echo ""
