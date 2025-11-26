# GitHub Actions + EC2 Docker Setup Guide (PowerShell)

Complete step-by-step guide for setting up automated Docker deployment using GitHub Actions.

## Overview

```
Your Local Machine (PowerShell)
    ↓ git push origin master
GitHub Repository
    ↓
GitHub Actions
    ├─ Build Docker image
    ├─ Push to GitHub Container Registry
    └─ Deploy to EC2 (via SSH)
    ↓
AWS EC2 Ubuntu Instance (Static IP)
    └─ Running Docker container
```

## Architecture

- **Build:** GitHub Actions builds Docker image and pushes to `ghcr.io`
- **Deploy:** GitHub Actions SSH into EC2 and pulls latest image
- **Runtime:** Docker Compose runs the application
- **Updates:** Automatic on every push to master

## Prerequisites

✅ AWS EC2 Ubuntu instance with static IP (Elastic IP)  
✅ GitHub repository with code  
✅ PowerShell on local machine  
✅ Basic understanding of AWS, GitHub, and SSH

## Phase 1: EC2 Setup (10 minutes)

### Step 1.1: Connect to EC2

```powershell
# Replace with your EC2 public IP and key pair path
$EC2_IP = "54.123.45.67"
$KEY_PATH = "C:\Users\YourUser\your-ec2-key.pem"

# SSH into EC2
ssh -i $KEY_PATH ubuntu@$EC2_IP
```

### Step 1.2: Run Setup Script

On your EC2 instance (in the SSH session):

```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/Button-20/juzbuild-background-processor/master/setup-ec2.sh | bash
```

This will:
- Install Docker and Docker Compose
- Install Git
- Create `/opt/juzbuild-background-processor` directory
- Create `.env` file template
- Setup SSH permissions

### Step 1.3: Update Environment Variables

Still on EC2:

```bash
# Edit the .env file
nano /opt/juzbuild-background-processor/.env
```

Update these critical variables:

```bash
MONGODB_URI=mongodb+srv://your-user:your-pass@cluster.mongodb.net/Juzbuild
REDIS_URL=redis://your-redis-host:6379
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxx
VERCEL_TOKEN=your-vercel-token
NAMECHEAP_API_KEY=your-api-key
NAMECHEAP_CLIENT_IP=54.123.45.67  # Your EC2 static IP
BACKGROUND_PROCESSOR_SECRET=your-secret-here
JUZBUILD_RESEND_API_KEY=your-resend-key
```

Save with: `Ctrl+X` → `Y` → `Enter`

### Step 1.4: Verify Setup

Still on EC2:

```bash
# Navigate to app directory
cd /opt/juzbuild-background-processor

# Verify git is set up
git remote -v

# Verify .env file
cat .env | head -20

# Logout from EC2
exit
```

## Phase 2: SSH Key Setup (10 minutes)

This allows GitHub Actions to securely access your EC2 instance.

### Step 2.1: Generate SSH Key (PowerShell)

```powershell
# Go to your home directory
cd $HOME

# Generate SSH key pair (name it: ec2-github-actions)
ssh-keygen -t rsa -b 4096 -f ec2-github-actions -C "github-actions" -N ""

# View the files created
ls ec2-github-actions*
# Output:
#   Mode                 LastWriteTime         Length Name
#   ----                 -------------         ------ ----
#   -a---         11/26/2025  10:00 AM           3243 ec2-github-actions      (PRIVATE KEY)
#   -a---         11/26/2025  10:00 AM            754 ec2-github-actions.pub  (PUBLIC KEY)
```

### Step 2.2: Add Public Key to EC2 (PowerShell)

```powershell
$EC2_IP = "54.123.45.67"
$KEY_PATH = "C:\Users\YourUser\your-ec2-key.pem"
$PUB_KEY = Get-Content "$HOME\ec2-github-actions.pub"

# SSH into EC2 and add the public key
ssh -i $KEY_PATH ubuntu@$EC2_IP "echo '$PUB_KEY' >> ~/.ssh/authorized_keys; chmod 600 ~/.ssh/authorized_keys"

echo "✅ Public key added to EC2"
```

### Step 2.3: Verify SSH Access

```powershell
# Test SSH access with the new key
ssh -i "$HOME\ec2-github-actions" ubuntu@$EC2_IP "echo 'SSH access successful!'"

# Should output: SSH access successful!
```

## Phase 3: GitHub Setup (5 minutes)

### Step 3.1: Get Private Key Content

```powershell
# Display the private key (you'll need to copy this)
Get-Content "$HOME\ec2-github-actions" -Raw | Set-Clipboard

Write-Host "✅ Private key copied to clipboard!"
Write-Host "It starts with: -----BEGIN RSA PRIVATE KEY-----"
```

### Step 3.2: Add GitHub Secrets

1. Open: https://github.com/Button-20/juzbuild-background-processor/settings/secrets/actions
2. Click "New repository secret"
3. Add these 3 secrets:

#### Secret 1: EC2_PRIVATE_KEY
- **Name:** `EC2_PRIVATE_KEY`
- **Value:** Paste the entire content of `ec2-github-actions` file (from clipboard)
- Click "Add secret"

#### Secret 2: EC2_USER
- **Name:** `EC2_USER`
- **Value:** `ubuntu`
- Click "Add secret"

#### Secret 3: EC2_HOST
- **Name:** `EC2_HOST`
- **Value:** Your EC2 static IP (e.g., `54.123.45.67`)
- Click "Add secret"

### Step 3.3: Verify Secrets

Go back to the repository settings and confirm all 3 secrets appear (values are masked).

## Phase 4: Verify Everything (5 minutes)

### Step 4.1: Check Workflow File

```powershell
# Navigate to your local repository
cd "C:\Path\To\juzbuild-background-processor"

# Verify the workflow file exists
Get-Content ".github\workflows\deploy.yml" | Select-Object -First 20

# Should show GitHub Actions workflow YAML
```

### Step 4.2: Check Files Exist

```powershell
# Check required files
$files = @(
    "Dockerfile",
    "docker-compose.yml",
    "setup-ec2.sh",
    ".github\workflows\deploy.yml"
)

foreach ($file in $files) {
    $exists = Test-Path $file
    Write-Host "$file : $(if($exists){'✅ EXISTS'}else{'❌ MISSING'})"
}
```

### Step 4.3: Commit and Push

```powershell
# Make sure you're on master branch
git checkout master

# Add all files
git add -A

# Commit
git commit -m "Configure GitHub Actions Docker deployment"

# Push to trigger the pipeline
git push origin master

# Note: This may fail on first push (image doesn't exist yet), that's OK!
```

## Phase 5: Test Deployment (10 minutes)

### Step 5.1: Monitor GitHub Actions

1. Go to: https://github.com/Button-20/juzbuild-background-processor/actions
2. Click on the latest workflow run
3. Watch the "build" job
4. If it succeeds, the "deploy" job will run

**First deployment might fail** because the EC2 hasn't pulled the image yet. That's expected.

### Step 5.2: Test Manually (PowerShell)

```powershell
$EC2_IP = "54.123.45.67"
$KEY_PATH = "C:\Users\YourUser\ec2-github-actions"

# SSH into EC2
ssh -i $KEY_PATH ubuntu@$EC2_IP

# Once logged in:
cd /opt/juzbuild-background-processor

# Check if docker-compose is available
docker-compose --version

# Try pulling and running (this is what GitHub Actions does):
docker login ghcr.io -u your-github-username --password-stdin
# (paste your GitHub Personal Access Token)

docker pull ghcr.io/Button-20/juzbuild-background-processor:latest

# Start containers
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Health check
curl http://localhost:3001/health

# Exit
exit
```

### Step 5.3: Trigger Full Deployment

```powershell
# Make a minor change
echo "# Updated $(Get-Date)" >> README.md

# Commit and push
git add README.md
git commit -m "Trigger deployment"
git push origin master

# Watch at: https://github.com/Button-20/juzbuild-background-processor/actions
```

## Troubleshooting

### Build Fails: "Could not resolve ./src/server.ts"

**Cause:** Source files not found in build context

**Solution:**
```powershell
# Ensure files are tracked in git
git add src/ tsconfig.json package.json
git commit -m "Fix: add source files"
git push origin master
```

### Deploy Fails: "Permission denied (publickey)"

**Cause:** SSH key not properly added to EC2

**Solution:**
```powershell
# Verify the key was added
$EC2_IP = "54.123.45.67"
$KEY_PATH = "C:\Users\YourUser\your-ec2-key.pem"

ssh -i $KEY_PATH ubuntu@$EC2_IP "cat ~/.ssh/authorized_keys | grep -c github"
# Should output: 1

# If 0, re-add the key:
$PUB_KEY = Get-Content "$HOME\ec2-github-actions.pub"
ssh -i $KEY_PATH ubuntu@$EC2_IP "echo '$PUB_KEY' >> ~/.ssh/authorized_keys"
```

### Deploy Fails: "docker pull" errors

**Cause:** Not logged into Docker registry

**Solution:** Verify secrets are correct:
```powershell
# Go to GitHub repo settings → Secrets
# Check:
# - EC2_PRIVATE_KEY: Should start with "-----BEGIN RSA PRIVATE KEY-----"
# - EC2_USER: Should be "ubuntu"
# - EC2_HOST: Should be your IP (no https://, just IP)
```

### Service Not Running After Deploy

**Debug on EC2:**
```powershell
$EC2_IP = "54.123.45.67"
$KEY_PATH = "C:\Users\YourUser\ec2-github-actions"

ssh -i $KEY_PATH ubuntu@$EC2_IP

# Check logs
cd /opt/juzbuild-background-processor
docker-compose logs background-processor

# Check if image was pulled
docker images | grep juzbuild

# Check environment variables
grep MONGODB_URI .env

# Try restarting
docker-compose restart
sleep 10
curl http://localhost:3001/health
```

### Old Images Taking Space

**Clean up on EC2:**
```bash
# Remove images older than 72 hours
docker image prune -f --all --filter "until=72h"

# Remove unused volumes
docker volume prune -f

# Check space
docker system df
```

## Day-to-Day Workflow

After setup, here's how you deploy:

```powershell
# Make your changes
code src/server.ts

# Test locally
npm run dev
# (verify it works)

# Commit and push
git add src/server.ts
git commit -m "Add new feature"
git push origin master

# That's it! GitHub Actions will:
# 1. Build Docker image
# 2. Push to registry
# 3. Deploy to EC2
# 4. Verify health check
# 5. Clean up old images

# Monitor at: https://github.com/Button-20/juzbuild-background-processor/actions
```

## Monitoring Deployment

### GitHub Actions Dashboard
https://github.com/Button-20/juzbuild-background-processor/actions

### EC2 Logs
```powershell
$EC2_IP = "54.123.45.67"
$KEY = "C:\Users\YourUser\ec2-github-actions"

ssh -i $KEY ubuntu@$EC2_IP "cd /opt/juzbuild-background-processor && docker-compose logs -f"
```

### Service Health
```powershell
$EC2_IP = "54.123.45.67"
$KEY = "C:\Users\YourUser\ec2-github-actions"

ssh -i $KEY ubuntu@$EC2_IP "curl http://localhost:3001/health"
```

## Security Best Practices

✅ **Use GitHub Secrets** - Never commit credentials  
✅ **Rotate SSH Keys** - Regenerate keys every 90 days  
✅ **Restrict Security Groups** - Only allow SSH from your IP  
✅ **Monitor Deployments** - Check GitHub Actions logs regularly  
✅ **Update Dependencies** - Run `git pull` and rebuild regularly  
✅ **Keep EC2 Updated** - Run `sudo apt-get update && upgrade`

## Environment Variables Reference

These need to be set in EC2's `.env` file:

| Variable | Example | Where to Get |
|----------|---------|--------------|
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas |
| `REDIS_URL` | `redis://host:6379` | Redis Cloud or local |
| `GITHUB_TOKEN` | `ghp_...` | GitHub Personal Access Tokens |
| `VERCEL_TOKEN` | `vercel token` | Vercel Dashboard |
| `NAMECHEAP_API_KEY` | `from Namecheap` | Namecheap Account |
| `BACKGROUND_PROCESSOR_SECRET` | `any random string` | Create yourself |
| `JUZBUILD_RESEND_API_KEY` | `re_...` | Resend Dashboard |
| `GOOGLE_ANALYTICS_ACCOUNT_ID` | `your GA ID` | Google Analytics |

## Summary

| Step | Time | Checklist |
|------|------|-----------|
| EC2 Setup | 10min | Run setup script, update .env, logout |
| SSH Keys | 10min | Generate key, add to EC2, verify access |
| GitHub Secrets | 5min | Add 3 secrets to GitHub |
| Verification | 5min | Check files, commit, push |
| Testing | 10min | Monitor pipeline, verify service running |
| **Total** | **40min** | ✅ Automated deployment ready! |

## Next Steps

1. ✅ Follow Phase 1-5 above
2. ✅ Test with `git push origin master`
3. ✅ Monitor GitHub Actions dashboard
4. ✅ Verify service at `http://<EC2_IP>:3001/health`
5. ✅ Access logs with ssh
6. ✅ Make changes and push to auto-deploy

**You're done!** 🎉 Automated Docker deployment to EC2 is ready!
