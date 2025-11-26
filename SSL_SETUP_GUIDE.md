# SSL/TLS Setup Guide

This guide explains how to configure HTTPS/SSL for your JuzBuild Background Processor on AWS EC2.

## Overview

Your background processor will be secured with:
- **Let's Encrypt** SSL certificates (free, auto-renewing)
- **Nginx** as a reverse proxy (handles HTTPS, forwards to port 3001)
- **Automatic renewal** (certificates renew every 90 days automatically)

## Prerequisites

✅ EC2 instance is running (with setup-ec2.sh executed)  
✅ You own a domain name  
✅ Domain DNS records point to your EC2 static IP  
✅ AWS Security Group allows ports 80 (HTTP) and 443 (HTTPS) inbound  

## Quick Start (5 minutes)

### 1. Point Your Domain to EC2

In your domain registrar (GoDaddy, Namecheap, etc.):

```
A Record:
Name: api (or your subdomain)
Value: YOUR-EC2-STATIC-IP
TTL: 3600
```

Wait 5-10 minutes for DNS to propagate.

### 2. SSH to Your EC2 Instance

```powershell
ssh -i your-key.pem ubuntu@YOUR-EC2-IP
```

### 3. Run SSL Setup

```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/Button-20/juzbuild-background-processor/master/setup-ssl.sh | bash -s -- api.yourdomain.com admin@yourdomain.com
```

Or if you cloned the repo:

```bash
cd /opt/juzbuild-background-processor
chmod +x setup-ssl.sh
./setup-ssl.sh api.yourdomain.com admin@yourdomain.com
```

### 4. Verify Setup

```bash
# Test from EC2
curl https://api.yourdomain.com/health

# Or from your local machine
curl https://YOUR-DOMAIN/health -v
```

Expected response:
```json
{
  "status": "healthy",
  "service": "juzbuild-background-processor",
  "redis": "connected",
  "timestamp": "2025-11-26T19:36:59.353Z"
}
```

## What the Script Does

1. ✅ Installs Nginx web server
2. ✅ Installs Certbot (Let's Encrypt client)
3. ✅ Requests free SSL certificate from Let's Encrypt
4. ✅ Configures Nginx as reverse proxy
5. ✅ Sets up automatic certificate renewal
6. ✅ Enables HTTPS on port 443
7. ✅ Redirects HTTP (port 80) to HTTPS

## Manual Steps (if script fails)

### Step 1: Install Nginx & Certbot

```bash
sudo apt-get update
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

### Step 2: Get SSL Certificate

```bash
sudo certbot certonly --standalone \
    -d api.yourdomain.com \
    --non-interactive \
    --agree-tos \
    -m admin@yourdomain.com
```

### Step 3: Configure Nginx

```bash
# Copy the nginx.conf from the repo
sudo cp /opt/juzbuild-background-processor/nginx.conf \
    /etc/nginx/sites-available/juzbuild-bg-processor

# Replace YOUR-DOMAIN.com with your actual domain
sudo sed -i 's/YOUR-DOMAIN.com/api.yourdomain.com/g' \
    /etc/nginx/sites-available/juzbuild-bg-processor

# Enable the configuration
sudo ln -sf /etc/nginx/sites-available/juzbuild-bg-processor /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Architecture

```
Internet (Client)
    ↓
Port 443 (HTTPS)
    ↓
Nginx Reverse Proxy
    ↓
Port 3001 (Docker Container)
    ↓
JuzBuild Background Processor
    ↓
Redis + MongoDB
```

## After SSL Setup

### Update Your Main App

Update your main app's `.env.local` to use HTTPS:

```env
BACKGROUND_PROCESSOR_URL=https://api.yourdomain.com
BACKGROUND_PROCESSOR_SECRET=4e4b1b1df8ce74a8eb7500e994141fcb7a91862a5669dd3eb8a21f079c7ffd2a
```

### Test the Connection

```powershell
# From your local machine
$URL = "https://api.yourdomain.com/health"
Invoke-WebRequest -Uri $URL -Verbose
```

## Certificate Management

### View Certificate Details

```bash
sudo certbot certificates
```

Output:
```
Found the following certs:
  Certificate Name: api.yourdomain.com
    Domains: api.yourdomain.com, www.api.yourdomain.com
    Expiry Date: 2025-02-24 (VALID: 90 days)
    Certificate Path: /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/api.yourdomain.com/privkey.pem
```

### Manual Certificate Renewal

```bash
sudo certbot renew
```

### Auto-Renewal Status

```bash
sudo systemctl status certbot.timer
```

## Troubleshooting

### DNS Not Propagating

```bash
# Check if DNS is updated
nslookup api.yourdomain.com

# Wait 10-15 minutes if not updated yet
```

### Port 80 or 443 Already in Use

```bash
# Check what's using the ports
sudo lsof -i :80
sudo lsof -i :443

# Kill the process if needed
sudo kill -9 <PID>
```

### Nginx Configuration Error

```bash
# Test configuration
sudo nginx -t

# View the error in detail
sudo nginx -T

# Check logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Expired

Let's Encrypt certificates auto-renew, but if you see an expired error:

```bash
# Force renewal
sudo certbot renew --force-renewal

# Restart Nginx
sudo systemctl restart nginx
```

### Connection Refused on Port 443

```bash
# Check if Nginx is running
sudo systemctl status nginx

# Check if Docker containers are running
docker-compose ps

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Security Best Practices

✅ **HSTS Headers** - Forces HTTPS on all future requests  
✅ **Security Headers** - Protects against XSS and other attacks  
✅ **TLS 1.2+** - No outdated SSL/TLS versions  
✅ **Strong Ciphers** - Uses modern encryption algorithms  
✅ **Auto-Renewal** - Never worry about expired certificates  

## Testing Your SSL Setup

### Test HTTPS Connection

```bash
curl -v https://api.yourdomain.com/health
```

Look for:
```
* SSL connection using TLSv1.3
* Server certificate:
*  subject: CN=api.yourdomain.com
*  issuer: C=US, O=Let's Encrypt, CN=R3
*  certificate valid from: 2024-11-26 to 2025-02-24
```

### Check Certificate Grade

Use SSL Labs to verify your setup:
https://www.ssllabs.com/ssltest/analyze.html?d=api.yourdomain.com

### Monitor Certificate Expiration

```bash
# View expiration date
sudo certbot certificates | grep "Expiry Date"

# Set up email reminders (automatic)
# Certbot sends renewal reminders 30 days before expiration
```

## FAQ

**Q: How much does Let's Encrypt cost?**  
A: Free! No credit card required.

**Q: How long are certificates valid?**  
A: 90 days. But they auto-renew, so you never need to manually renew.

**Q: What if renewal fails?**  
A: Certbot sends email reminders 30 days before expiration. You can manually renew anytime.

**Q: Can I use a wildcard certificate?**  
A: Yes! Use `*.yourdomain.com` during setup. You'll need to verify domain ownership via DNS.

**Q: Does this work with subdomains?**  
A: Yes! Your DNS setup can use subdomains like `api.yourdomain.com`, `bg.yourdomain.com`, etc.

## Monitoring & Maintenance

### Daily Monitoring

```bash
# Check service status
systemctl status nginx
docker-compose ps

# View recent logs
tail -20 /var/log/nginx/access.log
docker-compose logs -n 50 background-processor
```

### Weekly Maintenance

```bash
# Check certificate expiration
sudo certbot certificates

# Update system
sudo apt-get update && sudo apt-get upgrade -y
```

### Monthly Monitoring

```bash
# Check disk space
df -h

# Check certificate auto-renewal logs
sudo tail -100 /var/log/letsencrypt/renew.log
```

## Next Steps

1. ✅ Domain DNS configured
2. ✅ Run `setup-ssl.sh` script
3. ✅ Test HTTPS connection
4. ✅ Update main app `.env`
5. ✅ Monitor certificate status

Your background processor is now production-ready with enterprise-grade SSL/TLS! 🔒

---

**Need help?** Check the logs:
```bash
# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Docker logs
docker-compose logs -f background-processor

# Certbot logs
sudo tail -f /var/log/letsencrypt/renew.log
```
