# Complete CI/CD Pipeline Setup Guide

## Overview

You now have a complete automated CI/CD pipeline that:
1. **Builds** Docker images on every push to master
2. **Pushes** to GitHub Container Registry (ghcr.io)
3. **Deploys** automatically to your AWS EC2 instance
4. **Verifies** health checks after deployment
5. **Cleans** up old images to save space

## Architecture Diagram

```
Your Local Machine
       ↓ (git push origin master)
GitHub Repository
       ↓
GitHub Actions (Build)
  - Checkout code
  - Build Docker image with caching
  - Push to ghcr.io
       ↓ (on success)
GitHub Actions (Deploy)
  - SSH to EC2
  - Pull new image
  - Stop old containers
  - Start new containers
  - Health check
       ↓
AWS EC2 Instance (Static IP)
  - Running Docker container
  - Accessible via HTTP/HTTPS
```

## Files Created

### 1. `.github/workflows/deploy.yml`
- Main CI/CD pipeline workflow
- Builds Docker image with layer caching
- Pushes to GitHub Container Registry
- Deploys to EC2 via SSH
- Includes health checks

### 2. `GITHUB_ACTIONS_SETUP.md`
- Comprehensive setup guide
- Step-by-step instructions
- Troubleshooting tips
- Security best practices

### 3. `docker-compose.ec2.yml`
- EC2-specific docker-compose file
- Pulls pre-built image from registry
- Includes logging configuration
- Ready for production

### 4. `setup-ec2-github-actions.sh`
- Automated EC2 setup script
- Installs Docker, Docker Compose, Git
- Creates application directory
- Sets up SSH and permissions

## Quick Setup (5 Minutes)

### Step 1: Generate SSH Key (Local Machine)

```bash
ssh-keygen -t rsa -b 4096 -f ec2-github-actions -C "github-actions" -N ""
cat ec2-github-actions      # Copy this
cat ec2-github-actions.pub  # Also copy this
```

### Step 2: Add Public Key to EC2

```bash
ssh -i your-ec2-key.pem ubuntu@your-ec2-ip
nano ~/.ssh/authorized_keys  # Paste the public key
chmod 600 ~/.ssh/authorized_keys
exit
```

### Step 3: Add GitHub Secrets

Go to: https://github.com/Button-20/juzbuild-background-processor/settings/secrets/actions

Add 3 secrets:
```
EC2_PRIVATE_KEY = (entire content of ec2-github-actions file)
EC2_USER = ubuntu
EC2_HOST = your.ec2.static.ip
```

### Step 4: Prepare EC2

```bash
ssh -i your-ec2-key.pem ubuntu@your-ec2-ip
bash <(curl -s https://raw.githubusercontent.com/Button-20/juzbuild-background-processor/master/setup-ec2-github-actions.sh)
```

Then update the `.env` file on EC2:
```bash
nano /opt/juzbuild-background-processor/.env
# Update with your actual secrets
```

### Step 5: Trigger Deployment

```bash
git push origin master
```

Then watch at: https://github.com/Button-20/juzbuild-background-processor/actions

## Pipeline Features

### ✅ Automatic on Push
- Every push to `master` or `main` triggers the pipeline
- Pull requests run build only (no deploy)
- Manual trigger available via workflow_dispatch

### ✅ Docker Image Caching
- Multi-layer caching for faster builds
- Typical build time: 30-60 seconds
- First build: 2-3 minutes (no cache)

### ✅ Smart Deployment
- Only deploys on master/main branch pushes
- Pulls latest code from GitHub
- Graceful container restart
- Health check verification
- Automatic cleanup of old images

### ✅ Security
- SSH key-based authentication to EC2
- GitHub Secrets for sensitive data
- No credentials in code
- Health checks ensure service is running

## Monitoring Deployments

### Via GitHub
1. Go to: https://github.com/Button-20/juzbuild-background-processor/actions
2. Click on the workflow run
3. Watch build and deploy steps in real-time

### Via EC2
```bash
ssh -i your-ec2-key.pem ubuntu@your-ec2-ip
cd /opt/juzbuild-background-processor
docker-compose logs -f background-processor
```

## Typical Workflow

```bash
# 1. Make changes locally
vim src/server.ts
npm run dev  # Test locally

# 2. Commit and push
git add src/server.ts
git commit -m "Add feature X"
git push origin master

# 3. Watch pipeline
# - Go to GitHub Actions tab
# - See build start
# - Watch deploy step

# 4. Verify on EC2
# - Service updated automatically
# - Health check passes
# - Your changes are live!

# 5. Done!
curl http://your-ec2-ip:3001/health
```

## Troubleshooting

### Build Fails
```
Error: Could not resolve "./src/server.ts"
```
**Solution:** Ensure files are committed:
```bash
git add src/ tsconfig.json package.json
git push origin master
```

### Deploy Fails: SSH Error
```
Permission denied (publickey)
```
**Solution:** Verify secrets on GitHub:
1. GitHub Settings → Secrets
2. Check EC2_PRIVATE_KEY is correct
3. Check EC2_USER = ubuntu
4. Check EC2_HOST is the static IP

### Deploy Fails: Docker Pull Error
**Solution:** Verify Docker login on EC2:
```bash
ssh ubuntu@your-ec2-ip
echo "your-github-token" | docker login ghcr.io -u your-github-username --password-stdin
```

### Service Not Responding After Deploy
**Solution:** Check logs:
```bash
ssh ubuntu@your-ec2-ip
cd /opt/juzbuild-background-processor
docker-compose logs background-processor
sleep 10  # Wait for startup
curl http://localhost:3001/health
```

## Manual Deployment (if pipeline fails)

```bash
ssh -i your-ec2-key.pem ubuntu@your-ec2-ip << 'EOF'
  cd /opt/juzbuild-background-processor
  git pull origin master
  docker-compose down
  docker pull ghcr.io/Button-20/juzbuild-background-processor:latest
  docker-compose -f docker-compose.ec2.yml up -d
  sleep 10
  curl http://localhost:3001/health
EOF
```

## Performance

### Build Times
- **First build:** 2-3 minutes
- **Subsequent builds:** 30-60 seconds (with cache)
- **Deploy to EC2:** 2-3 minutes
- **Total time:** 5-10 minutes from push to live

### Storage
- **Docker image:** ~160MB
- **Old images auto-cleaned:** Images older than 72 hours
- **EC2 space required:** ~2-3GB for Docker

## Next Steps

1. ✅ Generate SSH key
2. ✅ Add GitHub Secrets
3. ✅ Run setup script on EC2
4. ✅ Update .env file on EC2
5. ✅ Test pipeline with git push
6. ✅ Verify deployment on EC2

## Environment Update

If you need to update environment variables:

1. **On EC2:**
   ```bash
   nano /opt/juzbuild-background-processor/.env
   # Update variable
   docker-compose restart background-processor
   ```

2. **Or trigger redeploy:**
   ```bash
   git push origin master  # triggers full rebuild
   ```

## Scaling Up

To run multiple instances:

```bash
# On EC2
cd /opt/juzbuild-background-processor
docker-compose up -d --scale background-processor=3
```

Then add nginx for load balancing.

## Support

For issues:
1. Check GitHub Actions logs
2. Check EC2 logs: `docker-compose logs`
3. Check health endpoint: `curl http://localhost:3001/health`
4. Open GitHub issue

---

**Status:** ✅ Complete and ready to deploy!
