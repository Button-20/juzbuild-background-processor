# 🚀 Docker + GitHub Actions + AWS EC2 - Complete Setup

Everything is configured and ready to go! Follow the simple steps below.

## What You've Got

✅ **GitHub Actions CI/CD Pipeline**
- Automatically builds Docker image on every push
- Pushes to GitHub Container Registry (ghcr.io)
- Deploys to EC2 via SSH
- Includes health checks

✅ **EC2 Setup Script**
- One-command installation of Docker, Docker Compose, Git
- Creates application directory
- Generates `.env` template

✅ **Comprehensive Documentation**
- PowerShell setup guide (for Windows users)
- Complete setup checklist
- Troubleshooting guide
- Step-by-step instructions

## Quick Start (40 minutes)

### Step 1: Prepare EC2 (10 minutes)

SSH into your EC2 instance:

```powershell
# PowerShell on your local machine
$EC2_IP = "54.123.45.67"  # Your EC2 static IP
$KEY_PATH = "C:\path\to\your-ec2-key.pem"
ssh -i $KEY_PATH ubuntu@$EC2_IP
```

Run the setup script:

```bash
# On EC2 instance
curl -fsSL https://raw.githubusercontent.com/Button-20/juzbuild-background-processor/master/setup-ec2.sh | bash
```

Update environment variables:

```bash
# On EC2 instance
nano /opt/juzbuild-background-processor/.env
# Update: MONGODB_URI, REDIS_URL, VERCEL_TOKEN, etc.
# Save: Ctrl+X → Y → Enter
exit
```

### Step 2: Generate SSH Key (10 minutes)

On your local machine (PowerShell):

```powershell
# Generate key pair
cd $HOME
ssh-keygen -t rsa -b 4096 -f ec2-github-actions -C "github-actions" -N ""

# Add public key to EC2
$EC2_IP = "54.123.45.67"
$KEY_PATH = "C:\path\to\your-ec2-key.pem"
$PUB_KEY = Get-Content "$HOME\ec2-github-actions.pub"
ssh -i $KEY_PATH ubuntu@$EC2_IP "echo '$PUB_KEY' >> ~/.ssh/authorized_keys; chmod 600 ~/.ssh/authorized_keys"

# Verify it works
ssh -i "$HOME\ec2-github-actions" ubuntu@$EC2_IP "echo 'Success!'"
```

### Step 3: Add GitHub Secrets (5 minutes)

1. Copy your private key:
   ```powershell
   Get-Content "$HOME\ec2-github-actions" -Raw | Set-Clipboard
   ```

2. Go to: https://github.com/Button-20/juzbuild-background-processor/settings/secrets/actions

3. Add 3 secrets:
   - **EC2_PRIVATE_KEY** = Paste from clipboard
   - **EC2_USER** = `ubuntu`
   - **EC2_HOST** = Your EC2 IP

### Step 4: Trigger Deployment (5 minutes)

```powershell
# Local machine
cd "C:\path\to\juzbuild-background-processor"
git push origin master
```

Watch at: https://github.com/Button-20/juzbuild-background-processor/actions

### Step 5: Verify (10 minutes)

```powershell
# Check if running
ssh -i "$HOME\ec2-github-actions" ubuntu@$EC2_IP "curl http://localhost:3001/health"
# Should return: {"status":"healthy",...}
```

**That's it! You're done! 🎉**

## Architecture

```
Your Code
    ↓ git push
GitHub Repository
    ↓
GitHub Actions
    ├─ Build Docker image (2 min)
    ├─ Push to ghcr.io (1 min)
    └─ Deploy to EC2 (2 min)
    ↓
AWS EC2 Ubuntu (Static IP)
    └─ Running Container
```

## Day-to-Day Workflow

```powershell
# 1. Make changes
code src/server.ts

# 2. Test locally
npm run dev

# 3. Push to deploy
git add src/server.ts
git commit -m "Feature: add XYZ"
git push origin master

# That's it! GitHub Actions handles the rest automatically.
```

## Files Created

| File | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | Main CI/CD pipeline |
| `Dockerfile` | Docker container definition |
| `docker-compose.yml` | Container orchestration |
| `setup-ec2.sh` | EC2 automated setup |
| `POWERSHELL_SETUP_GUIDE.md` | Detailed PowerShell instructions |
| `SETUP_CHECKLIST.md` | Step-by-step checklist |

## Documentation

- **For PowerShell Users:** Read `POWERSHELL_SETUP_GUIDE.md`
- **Quick Checklist:** Use `SETUP_CHECKLIST.md`
- **Troubleshooting:** See sections in `POWERSHELL_SETUP_GUIDE.md`

## Key Points

✅ **Fully Automated** - Push code → Automatic deploy  
✅ **Secure** - SSH keys, GitHub Secrets, no credentials in code  
✅ **Fast** - Build in 1-2 minutes, deploy in 2-3 minutes  
✅ **Reliable** - Health checks after every deployment  
✅ **Cost-Effective** - Only pay for EC2 instance, not Vercel  

## Estimated Timeline

| Phase | Time | Task |
|-------|------|------|
| 1 | 10min | Run EC2 setup script, update .env |
| 2 | 10min | Generate SSH key, add to EC2 |
| 3 | 5min | Add 3 GitHub Secrets |
| 4 | 5min | Push to master (trigger pipeline) |
| 5 | 10min | Verify deployment on EC2 |
| **Total** | **40min** | ✅ Ready to deploy! |

## Next Steps

1. Follow `SETUP_CHECKLIST.md` step by step
2. Trigger first deployment with `git push origin master`
3. Monitor at GitHub Actions dashboard
4. Verify service running on EC2
5. Start using for continuous deployment

## Commands Reference

### PowerShell (Local Machine)

```powershell
# Generate SSH key
ssh-keygen -t rsa -b 4096 -f ec2-github-actions -C "github-actions" -N ""

# SSH to EC2
ssh -i ec2-github-actions ubuntu@your-ec2-ip

# Copy private key for GitHub
Get-Content "$HOME\ec2-github-actions" -Raw | Set-Clipboard

# Push to trigger deployment
git push origin master
```

### Bash (EC2 Instance)

```bash
# Run setup script
curl -fsSL https://raw.githubusercontent.com/Button-20/juzbuild-background-processor/master/setup-ec2.sh | bash

# Update environment
nano /opt/juzbuild-background-processor/.env

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Health check
curl http://localhost:3001/health
```

## Troubleshooting Quick Ref

| Issue | Solution |
|-------|----------|
| Build fails | Check workflow file syntax, ensure all files committed |
| Deploy fails | Verify 3 GitHub Secrets are set correctly |
| SSH error | Test: `ssh -i ec2-github-actions ubuntu@ip "echo test"` |
| Service not running | SSH to EC2, run `docker-compose logs` |
| Health check fails | Wait 30s, check `docker-compose ps`, verify `.env` |

## Important Variables

Update these in EC2's `.env`:

```bash
MONGODB_URI=your-mongodb-connection
REDIS_URL=your-redis-connection
GITHUB_TOKEN=your-github-token
VERCEL_TOKEN=your-vercel-token
NAMECHEAP_API_KEY=your-namecheap-key
BACKGROUND_PROCESSOR_SECRET=any-random-string
JUZBUILD_RESEND_API_KEY=your-resend-key
GOOGLE_ANALYTICS_ACCOUNT_ID=your-analytics-id
```

## Support

- **Setup Guide:** POWERSHELL_SETUP_GUIDE.md
- **Checklist:** SETUP_CHECKLIST.md
- **GitHub Issues:** https://github.com/Button-20/juzbuild-background-processor/issues
- **GitHub Actions Docs:** https://docs.github.com/en/actions

---

**Status:** ✅ Everything configured and ready!

**Start with:** `SETUP_CHECKLIST.md`

Good luck! 🚀
