#!/bin/bash

# Fix Certificate Renewal Configuration
# This script fixes the webroot configuration for certificate renewal

set -e

DOMAIN="$1"

if [ -z "$DOMAIN" ]; then
    echo "❌ Missing domain argument"
    echo "Usage: $0 <domain>"
    echo "Example: $0 bgp.juzbuild.com"
    exit 1
fi

echo "=========================================="
echo "🔧 Fixing Certificate Renewal Configuration"
echo "=========================================="
echo ""

# Ensure webroot directory exists and is properly owned
echo "📁 Creating webroot directory..."
sudo mkdir -p /var/www/html
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

echo "✅ Webroot directory ready"
echo ""

# Update Nginx config with proper .well-known handling
echo "⚙️  Updating Nginx configuration..."
sudo cp nginx.conf /etc/nginx/sites-available/juzbuild-bg-processor
sudo sed -i "s/YOUR-DOMAIN.com/$DOMAIN/g" /etc/nginx/sites-available/juzbuild-bg-processor

# Enable the site if not already enabled
sudo ln -sf /etc/nginx/sites-available/juzbuild-bg-processor /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
echo "✅ Testing Nginx configuration..."
sudo nginx -t

if [ $? -ne 0 ]; then
    echo "❌ Nginx configuration has errors"
    exit 1
fi

# Reload Nginx
echo "🚀 Reloading Nginx..."
sudo systemctl reload nginx

echo ""
echo "=========================================="
echo "✅ Configuration Fixed!"
echo "=========================================="
echo ""

# Verify the directory
echo "📋 Verifying webroot directory..."
ls -la /var/www/html

echo ""
echo "🧪 Testing renewal with new configuration..."
sudo certbot renew --dry-run --webroot -w /var/www/html -d "$DOMAIN" --force-renewal

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Renewal test successful!"
    echo ""
    echo "🔄 Now performing actual renewal..."
    sudo certbot certonly --webroot -w /var/www/html -d "$DOMAIN" --force-renewal
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Certificate renewed successfully!"
        echo ""
        echo "🚀 Reloading Nginx..."
        sudo systemctl reload nginx
        
        echo "✅ Renewal complete!"
    else
        echo "❌ Renewal failed"
        exit 1
    fi
else
    echo "❌ Renewal test failed"
    exit 1
fi

echo ""
echo "📝 Certificate renewal is now properly configured"
echo "   Auto-renewal will work with this configuration"
echo ""
