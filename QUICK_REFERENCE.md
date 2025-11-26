# Quick Reference Card - Docker + GitHub Actions + EC2

Print this or keep it handy!

## Setup Sequence (40 minutes total)

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: EC2 Setup (10 min)                              │
│ ✅ SSH to EC2                                           │
│ ✅ curl setup script                                    │
│ ✅ nano .env (update variables)                         │
│ ✅ exit                                                 │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 2: SSH Key (10 min)                                │
│ ✅ ssh-keygen (local machine)                           │
│ ✅ Add public key to EC2                                │
│ ✅ Test SSH access                                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 3: GitHub Secrets (5 min)                          │
│ ✅ Copy private key to clipboard                        │
│ ✅ Add EC2_PRIVATE_KEY                                  │
│ ✅ Add EC2_USER = ubuntu                                │
│ ✅ Add EC2_HOST = your.ip                               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 4: Deploy (5 min)                                  │
│ ✅ git push origin master                               │
│ ✅ Watch GitHub Actions                                 │
│ ✅ Wait for green checkmarks                            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 5: Verify (10 min)                                 │
│ ✅ SSH to EC2                                           │
│ ✅ curl http://localhost:3001/health                    │
│ ✅ docker-compose logs                                  │
│ ✅ Confirm service running                              │
└─────────────────────────────────────────────────────────┘
```

## PowerShell Commands

```powershell
# SETUP EC2
ssh -i your-key.pem ubuntu@54.123.45.67
curl -fsSL https://raw.githubusercontent.com/Button-20/juzbuild-background-processor/master/setup-ec2.sh | bash
nano /opt/juzbuild-background-processor/.env
exit

# GENERATE SSH KEY
cd $HOME
ssh-keygen -t rsa -b 4096 -f ec2-github-actions -C "github-actions" -N ""

# ADD PUBLIC KEY TO EC2
$EC2_IP = "54.123.45.67"
$Key = "your-ec2-key.pem"
$PUB = Get-Content "$HOME\ec2-github-actions.pub"
ssh -i $Key ubuntu@$EC2_IP "echo '$PUB' >> ~/.ssh/authorized_keys; chmod 600 ~/.ssh/authorized_keys"

# COPY PRIVATE KEY
Get-Content "$HOME\ec2-github-actions" -Raw | Set-Clipboard

# DEPLOY
git push origin master

# CHECK STATUS
ssh -i "$HOME\ec2-github-actions" ubuntu@$EC2_IP "curl http://localhost:3001/health"
```

## GitHub Secrets to Add

Go to: https://github.com/Button-20/juzbuild-background-processor/settings/secrets/actions

```
Name: EC2_PRIVATE_KEY
Value: -----BEGIN RSA PRIVATE KEY-----
       [entire private key file content]
       -----END RSA PRIVATE KEY-----

Name: EC2_USER
Value: ubuntu

Name: EC2_HOST
Value: 54.123.45.67
```

## Daily Workflow

```powershell
# 1. Code
code src/server.ts

# 2. Test
npm run dev

# 3. Commit & Push
git add src/server.ts
git commit -m "Add feature"
git push origin master

# 4. GitHub Actions automatically:
#    - Builds Docker image
#    - Pushes to registry
#    - Deploys to EC2
#    - Verifies health check
#    - Your code is live!
```

## Monitoring

```
GitHub Actions Dashboard:
https://github.com/Button-20/juzbuild-background-processor/actions

EC2 Logs:
ssh ubuntu@ip
docker-compose logs -f

Health Check:
curl http://your-ec2-ip:3001/health
```

## Important Files

| File | Use |
|------|-----|
| `.github/workflows/deploy.yml` | CI/CD pipeline |
| `Dockerfile` | Docker image |
| `docker-compose.yml` | Container config |
| `setup-ec2.sh` | EC2 setup script |
| `POWERSHELL_SETUP_GUIDE.md` | Detailed guide |
| `SETUP_CHECKLIST.md` | Step-by-step checklist |

## Environment Variables (Update on EC2)

```bash
MONGODB_URI=          # Your MongoDB connection
REDIS_URL=            # Your Redis connection
GITHUB_TOKEN=         # GitHub personal access token
VERCEL_TOKEN=         # Vercel API token
NAMECHEAP_API_KEY=    # Namecheap API key
NAMECHEAP_CLIENT_IP=  # Your EC2 static IP
BACKGROUND_PROCESSOR_SECRET=  # Random secure string
JUZBUILD_RESEND_API_KEY=      # Resend API key
GOOGLE_ANALYTICS_ACCOUNT_ID=  # Google Analytics ID
```

## Quick Fixes

| Problem | Fix |
|---------|-----|
| Build fails | `git add -A && git push` |
| SSH error | Test: `ssh -i ec2-key ubuntu@ip "echo test"` |
| Deploy fails | Check GitHub Secrets are correct |
| Service down | SSH to EC2, run `docker-compose logs` |
| Health check fails | Wait 30s and retry |

## Time Breakdown

```
EC2 Setup .................. 10 minutes
SSH Key Setup .............. 10 minutes
GitHub Secrets ............. 5 minutes
First Deployment ........... 5 minutes
Verification ............... 10 minutes
────────────────────────────────────
TOTAL ....................... 40 minutes
```

## After Setup: Deploy New Code

```
1. Make changes in your IDE
2. Test locally: npm run dev
3. Push: git push origin master
4. Watch: github.com/.../actions
5. Done! Service updates automatically
```

## Documentation Links

- Full Setup Guide: `POWERSHELL_SETUP_GUIDE.md`
- Quick Checklist: `SETUP_CHECKLIST.md`
- Deployment Guide: `README_DEPLOYMENT.md`

## Emergency Commands

```bash
# SSH to EC2
ssh -i path/to/key ubuntu@your-ip

# View logs
docker-compose logs -f

# Restart service
docker-compose restart

# Check status
docker-compose ps

# Health check
curl http://localhost:3001/health

# Clear old images
docker image prune -f --all --filter "until=72h"
```

---

**Everything is ready! Start with:** `SETUP_CHECKLIST.md`
