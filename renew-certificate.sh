#!/bin/bash

# Manual Certificate Renewal Script
# This can be used if auto-renewal fails
# Usage: ./renew-certificate.sh <domain>
# Example: ./renew-certificate.sh bgp.juzbuild.com

set -e

DOMAIN="$1"

if [ -z "$DOMAIN" ]; then
    echo "❌ Missing domain argument"
    echo "Usage: $0 <domain>"
    echo "Example: $0 bgp.juzbuild.com"
    exit 1
fi

echo "=========================================="
echo "🔄 Renewing SSL Certificate for $DOMAIN"
echo "=========================================="
echo ""

# Method 1: Use webroot renewal (preferred with Nginx)
echo "🔐 Attempting webroot renewal..."
sudo certbot renew --webroot -w /var/www/html --force-renewal -d "$DOMAIN"

if [ $? -eq 0 ]; then
    echo "✅ Certificate renewed successfully!"
    echo ""
    echo "🚀 Reloading Nginx..."
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded"
else
    echo "⚠️  Webroot renewal failed, trying standalone..."
    echo ""
    
    # Method 2: Stop Nginx temporarily
    echo "🛑 Stopping Nginx..."
    sudo systemctl stop nginx
    
    echo "🔐 Attempting standalone renewal..."
    sudo certbot renew --standalone --force-renewal -d "$DOMAIN"
    
    if [ $? -eq 0 ]; then
        echo "✅ Certificate renewed successfully!"
    else
        echo "❌ Certificate renewal failed"
        echo ""
        echo "Restarting Nginx..."
        sudo systemctl start nginx
        exit 1
    fi
    
    echo ""
    echo "🚀 Restarting Nginx..."
    sudo systemctl start nginx
    echo "✅ Nginx restarted"
fi

echo ""
echo "=========================================="
echo "✅ Certificate Renewal Complete!"
echo "=========================================="
echo ""

# Show certificate details
echo "📋 Certificate Details:"
sudo certbot certificates -d "$DOMAIN"
