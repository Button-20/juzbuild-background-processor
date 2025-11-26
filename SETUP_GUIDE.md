# Complete Setup Guide: Docker + GitHub Actions + AWS EC2

This guide walks you through setting up automated Docker deployment to AWS EC2 Ubuntu instance using GitHub Actions.

## 📋 Overview

```
Your Local Machine
    ↓ (git push)
GitHub Repository
    ↓
GitHub Actions
    ├─ Build Docker image
    ├─ Push to GitHub Container Registry (ghcr.io)
    └─ Deploy to EC2 via SSH
    
AWS EC2 Ubuntu Instance
    └─ Runs Docker container with your service
```

## ✅ Prerequisites

- AWS EC2 Ubuntu instance (t3.micro or larger)
- Static Elastic IP assigned to EC2
- GitHub repository access
- SSH key pair for EC2 access

## 🚀 Setup in 5 Steps

### Step 1: Generate SSH Key for GitHub Actions (Local Machine)

```bash
# Generate a new SSH key specifically for GitHub Actions
ssh-keygen -t rsa -b 4096 -f ec2-github-actions -C "github-actions" -N ""

# This creates two files:
# - ec2-github-actions (PRIVATE KEY - keep secret!)
# - ec2-github-actions.pub (PUBLIC KEY - add to EC2)

# View both files
cat ec2-github-actions       # Copy this value
cat ec2-github-actions.pub   # Copy this value
```

### Step 2: Add Public Key to EC2

```bash
# SSH into your EC2 instance
ssh -i your-ec2-key.pem ubuntu@your-ec2-static-ip

# Add the GitHub Actions public key
mkdir -p ~/.ssh
cat >> ~/.ssh/authorized_keys << 'EOF'
(paste content of ec2-github-actions.pub here)
EOF

# Set proper permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Test SSH key works
exit
ssh -i ec2-github-actions ubuntu@your-ec2-static-ip "echo 'SSH works!'"
```

### Step 3: Run EC2 Setup Script

```bash
# SSH into EC2
ssh -i your-ec2-key.pem ubuntu@your-ec2-static-ip

# Run the automated setup script
bash <(curl -s https://raw.githubusercontent.com/Button-20/juzbuild-background-processor/master/setup-ec2.sh)

# This will:
# ✅ Install Docker
# ✅ Install Docker Compose
# ✅ Install Git
# ✅ Clone the repository
# ✅ Create .env file template
```

### Step 4: Update .env File on EC2

The setup script creates an .env file template. Now update it with your actual secrets:

```bash
# On EC2
nano /opt/juzbuild-background-processor/.env

# Update these values:
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_url
GITHUB_TOKEN=your_github_personal_access_token
VERCEL_TOKEN=your_vercel_token
# ... update all required environment variables
```

### Step 5: Add GitHub Secrets

Go to your GitHub repository:

**https://github.com/Button-20/juzbuild-background-processor/settings/secrets/actions**

Click **"New repository secret"** and add these 3 secrets:

| Secret Name | Value |
|------------|-------|
| `EC2_PRIVATE_KEY` | Entire content of your `ec2-github-actions` file (private key) |
| `EC2_HOST` | Your EC2 static IP address (e.g., `54.123.45.67`) |
| `EC2_USERNAME` | `ubuntu` |

**Example:**
```
EC2_PRIVATE_KEY:
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
...
-----END RSA PRIVATE KEY-----

EC2_HOST: 54.123.45.67

EC2_USERNAME: ubuntu
```

## 🎯 Testing the Pipeline

### Trigger Deployment

Push to master to trigger the pipeline:

```bash
# Make a small change to test
echo "# Test" >> README.md
git add README.md
git commit -m "Test deployment pipeline"
git push origin master
```

### Monitor on GitHub

Go to: **https://github.com/Button-20/juzbuild-background-processor/actions**

You should see:
1. **Build** job - Builds Docker image and pushes to registry
2. **Deploy** job - Deploys to EC2

Watch the logs in real-time!

### Check on EC2

```bash
# SSH to EC2
ssh -i your-ec2-key.pem ubuntu@your-ec2-static-ip

# View running containers
docker-compose ps

# View logs
docker-compose logs -f background-processor

# Test health endpoint
curl http://localhost:3001/health
```

### Verify Success

If everything works:
- ✅ GitHub Actions shows successful build and deploy
- ✅ EC2 container is running
- ✅ Health endpoint returns 200

## 📊 How the Pipeline Works

### Build Stage (on every push to master)
1. Checkout code
2. Set up Docker Buildx
3. Login to GitHub Container Registry
4. Build Docker image
5. Push image to `ghcr.io/Button-20/juzbuild-background-processor:latest`

### Deploy Stage (only on master)
1. SSH to EC2
2. Pull latest code from GitHub
3. Login to Docker registry
4. Pull latest image
5. Stop old containers
6. Start new containers
7. Verify health check
8. Clean up old images

## 🔧 Common Issues & Fixes

### SSH Permission Denied

**Problem:** Deploy step fails with "Permission denied (publickey)"

**Solution:**
1. Verify public key was added to EC2:
   ```bash
   ssh -i your-ec2-key.pem ubuntu@your-ec2-static-ip
   cat ~/.ssh/authorized_keys
   ```
2. Check GitHub Secret `EC2_PRIVATE_KEY` is the PRIVATE key (not public)
3. Check GitHub Secret `EC2_HOST` is correct IP

### Docker Pull Fails

**Problem:** `Error response from daemon: Head "https://ghcr.io/..."`

**Solution:** Verify GitHub token permissions:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Ensure token has `write:packages` and `read:packages` scopes
3. Regenerate token if needed

### Health Check Fails

**Problem:** Service deploys but health check fails

**Solution:**
```bash
# SSH to EC2
ssh -i your-ec2-key.pem ubuntu@your-ec2-static-ip

# Check container logs
docker-compose logs background-processor

# Check if port 3001 is open
netstat -tuln | grep 3001

# Test manually
curl -v http://localhost:3001/health
```

### Container Exits Immediately

**Problem:** `docker-compose ps` shows container as exited

**Solution:**
```bash
# View detailed error logs
docker-compose logs background-processor

# Check .env file has all required variables
cat /opt/juzbuild-background-processor/.env

# Check environment variables are being read
docker-compose config
```

## 🔄 Making Changes

From now on, deployment is automatic:

1. **Make changes locally**
   ```bash
   vim src/server.ts
   ```

2. **Test locally (optional)**
   ```bash
   npm run dev
   ```

3. **Commit and push**
   ```bash
   git add src/server.ts
   git commit -m "Add feature X"
   git push origin master
   ```

4. **Automatic deployment starts**
   - GitHub Actions runs automatically
   - Monitor at: https://github.com/Button-20/juzbuild-background-processor/actions
   - Changes are live in ~5-10 minutes

5. **Verify on EC2**
   ```bash
   curl http://your-ec2-ip:3001/health
   ```

## 📈 Production Best Practices

### Security
- ✅ Use SSH keys, not passwords
- ✅ Rotate SSH keys regularly
- ✅ Don't commit .env or secrets to GitHub
- ✅ Use GitHub Secrets for sensitive data

### Monitoring
```bash
# Check disk space
df -h

# Check memory
free -h

# Check Docker disk usage
docker system df

# View all logs
docker-compose logs --follow
```

### Cleanup
```bash
# Remove old images (older than 7 days)
docker image prune -f --filter "until=168h"

# Remove unused volumes
docker volume prune -f

# Full cleanup
docker system prune -f
```

### Update Application

To update with latest code from GitHub:

```bash
ssh -i your-ec2-key.pem ubuntu@your-ec2-static-ip << 'EOF'
cd /opt/juzbuild-background-processor
docker-compose down
git pull origin master
docker pull ghcr.io/Button-20/juzbuild-background-processor:latest
docker-compose up -d
sleep 10
curl http://localhost:3001/health
EOF
```

## 🎓 Understanding the Files

| File | Purpose |
|------|---------|
| `.github/workflows/deploy-to-ec2.yml` | GitHub Actions workflow - handles build and deploy |
| `Dockerfile` | Builds Docker image from source code |
| `docker-compose.yml` | Defines how to run the container |
| `.dockerignore` | Files to exclude from Docker image |
| `setup-ec2.sh` | Automated EC2 setup script |

## 🚨 Troubleshooting Checklist

Before opening an issue, check:

- [ ] EC2 security group allows SSH (port 22) and HTTP (port 3001)
- [ ] GitHub Secrets are set correctly (3 secrets: EC2_PRIVATE_KEY, EC2_HOST, EC2_USERNAME)
- [ ] SSH key pair is correctly generated and public key is on EC2
- [ ] .env file on EC2 has all required variables
- [ ] Docker is running on EC2: `docker ps`
- [ ] GitHub Actions workflow shows green checkmarks
- [ ] Health endpoint works: `curl http://your-ec2-ip:3001/health`

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)

## ✨ You're Done!

Your automated pipeline is ready. Every time you push to master:
1. Docker image is automatically built
2. Image is pushed to GitHub registry
3. EC2 automatically deploys the latest version
4. Service is verified and running

Happy deploying! 🚀
