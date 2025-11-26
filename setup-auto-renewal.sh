#!/bin/bash

# Setup Automatic Certificate Renewal
# This ensures Let's Encrypt certificates auto-renew every 90 days

set -e

echo "=========================================="
echo "⏰ Setting Up Automatic Certificate Renewal"
echo "=========================================="
echo ""

# Ensure certbot is installed
echo "📦 Ensuring Certbot is installed..."
sudo apt-get install -y certbot python3-certbot-nginx

# Create a renewal hook script that reloads Nginx
echo "📝 Creating renewal hook script..."
sudo mkdir -p /etc/letsencrypt/renewal-hooks/post

sudo tee /etc/letsencrypt/renewal-hooks/post/nginx.sh > /dev/null <<'EOF'
#!/bin/bash
systemctl reload nginx
EOF

sudo chmod +x /etc/letsencrypt/renewal-hooks/post/nginx.sh

echo "✅ Renewal hook created"
echo ""

# Enable and start the certbot renewal timer
echo "⏰ Enabling Certbot renewal timer..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo "✅ Certbot renewal timer enabled"
echo ""

# Check renewal configuration
echo "🔍 Checking renewal configuration..."
sudo certbot certificates

echo ""
echo "=========================================="
echo "✅ Auto-Renewal Setup Complete!"
echo "=========================================="
echo ""

# Show status
echo "📊 Current Status:"
sudo systemctl status certbot.timer --no-pager

echo ""
echo "📋 Renewal will run:"
echo "   - Twice daily (at random times)"
echo "   - Certificates renew 30 days before expiration"
echo "   - Nginx automatically reloads after renewal"
echo ""

# Test dry-run
echo "🧪 Testing renewal (dry-run)..."
sudo certbot renew --dry-run

echo ""
echo "✅ Auto-renewal is now fully configured!"
echo ""
echo "📝 Manual renewal commands:"
echo "   sudo certbot renew                 # Renew all certificates"
echo "   sudo certbot renew --dry-run       # Test renewal without making changes"
echo "   sudo systemctl status certbot.timer # Check renewal timer status"
echo ""
