# GitHub Actions - EC2 Deployment Pipeline

This guide explains how to set up GitHub Actions to automatically build Docker images and deploy them to your AWS EC2 instance.

## Architecture

```
GitHub Repository
       ↓
GitHub Actions (Build)
       ↓
Docker Image → GitHub Container Registry (ghcr.io)
       ↓
GitHub Actions (Deploy)
       ↓
SSH → EC2 Instance
       ↓
Pull Image & Run docker-compose
```

## Prerequisites

1. **GitHub Repository** - Already have: https://github.com/Button-20/juzbuild-background-processor
2. **AWS EC2 Instance** - Ubuntu instance with static IP
3. **Docker installed on EC2** - Use the `deploy-ec2.sh` script first
4. **SSH Key Pair** - For accessing EC2 from GitHub Actions
5. **Git access** - EC2 can pull code from GitHub

## Step 1: Generate EC2 SSH Key Pair

On your local machine:

```bash
# Generate a new SSH key for GitHub Actions
ssh-keygen -t rsa -b 4096 -f ec2-github-actions -C "github-actions-ec2" -N ""

# View the private key
cat ec2-github-actions

# Copy the PUBLIC key to EC2
cat ec2-github-actions.pub
```

## Step 2: Add Public Key to EC2

SSH into your EC2 instance:

```bash
# SSH into EC2
ssh -i your-ec2-key.pem ubuntu@your-ec2-ip

# Add the GitHub Actions public key
nano ~/.ssh/authorized_keys

# Paste the public key from ec2-github-actions.pub
# Save and exit (Ctrl+X, then Y, then Enter)

# Set proper permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

## Step 3: Configure GitHub Secrets

Go to your GitHub repository:
1. Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add the following secrets:

### Required Secrets:

| Secret Name | Value | How to Get |
|------------|-------|-----------|
| `EC2_PRIVATE_KEY` | Contents of `ec2-github-actions` file | Copy the entire private key file content |
| `EC2_USER` | `ubuntu` | Standard EC2 Ubuntu user |
| `EC2_HOST` | Your EC2 static IP | Your AWS Elastic IP address |

Example:
```
EC2_PRIVATE_KEY: -----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
...
-----END RSA PRIVATE KEY-----

EC2_USER: ubuntu

EC2_HOST: 54.123.45.67
```

## Step 4: Prepare EC2 Instance

On your EC2 instance:

```bash
# Install Docker (if not already installed)
sudo yum update -y
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Clone the repository
cd /opt
sudo git clone https://github.com/Button-20/juzbuild-background-processor.git
cd juzbuild-background-processor
sudo chown -R ubuntu:ubuntu .

# Create .env file with your secrets
nano .env
# Paste environment variables here

# Initialize docker-compose (it will fail without the image, that's OK)
docker-compose config

# Create directories if needed
mkdir -p certs
```

## Step 5: Verify Pipeline

### Trigger a deployment:

Option 1: Push to master branch
```bash
git push origin master
```

Option 2: Use GitHub UI
- Go to Actions tab
- Click "Build and Deploy to AWS EC2"
- Click "Run workflow"

### Monitor the pipeline:

1. Go to your GitHub repository
2. Click "Actions" tab
3. Click on the workflow run
4. Watch the build and deploy steps execute

### Check deployment on EC2:

```bash
# SSH into EC2
ssh -i your-ec2-key.pem ubuntu@your-ec2-ip

# Check container status
docker-compose ps

# View logs
docker-compose logs -f background-processor

# Test health endpoint
curl http://localhost:3001/health
```

## Pipeline Workflow

### Build Stage:
1. ✅ Checkout code
2. ✅ Set up Docker Buildx
3. ✅ Log in to GitHub Container Registry
4. ✅ Build Docker image with caching
5. ✅ Push image to `ghcr.io/Button-20/juzbuild-background-processor:latest`

### Deploy Stage (only on master push):
1. ✅ SSH to EC2 instance
2. ✅ Pull latest code from GitHub
3. ✅ Log in to Docker registry
4. ✅ Pull latest Docker image
5. ✅ Stop old containers
6. ✅ Start new containers with docker-compose
7. ✅ Verify health check
8. ✅ Clean up old images

## Environment Variables on EC2

The `docker-compose.yml` on EC2 reads from `.env` file:

```bash
# On EC2, create/update .env file
nano /opt/juzbuild-background-processor/.env
```

Add:
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
REDIS_URL=redis://your-redis-url:6379
VERCEL_TOKEN=your-vercel-token
GITHUB_TOKEN=your-github-token
# ... all other environment variables
```

## Troubleshooting

### Build fails: "Could not resolve ./src/server.ts"

**Solution:** Ensure `.vercelignore` includes `src/` and `tsconfig.json`
```bash
git push origin master
```

### Deploy fails: "permission denied (publickey)"

**Solution:** Verify SSH key setup:
```bash
# On EC2
cat ~/.ssh/authorized_keys | grep github-actions

# On GitHub, verify secret is correct:
# Settings → Secrets → EC2_PRIVATE_KEY
```

### Deploy fails: "docker pull" error

**Solution:** Verify Docker login credentials:
```bash
# On EC2, test manual login
echo "your-github-token" | docker login ghcr.io -u your-github-username --password-stdin
```

### Deploy fails: "docker-compose: command not found"

**Solution:** Install Docker Compose on EC2:
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Health check fails after deployment

**Solution:** Give container time to start:
```bash
# On EC2
docker-compose logs background-processor

# Wait a bit and try again
sleep 20
curl http://localhost:3001/health
```

### Old images taking up space

**Solution:** Clean up old images (done automatically in pipeline):
```bash
# Manual cleanup
docker image prune -f --all --filter "until=72h"
docker volume prune -f
```

## Updating the Pipeline

### To modify deployment behavior:
1. Edit `.github/workflows/deploy.yml`
2. Push to GitHub
3. Changes apply to next deployment

### To add new deployment environment:
1. Add new secret with different EC2 details
2. Add new job in workflow with conditions

## Security Best Practices

1. ✅ **Use GitHub Secrets** - Never commit credentials
2. ✅ **Rotate SSH Keys** - Regularly update EC2_PRIVATE_KEY secret
3. ✅ **Restrict Security Groups** - Only allow GitHub Actions IPs
4. ✅ **Use GitHub Token** - Scoped personal access tokens for Docker registry
5. ✅ **Monitor Deployments** - Check Actions logs for suspicious activity
6. ✅ **Use SSH Keys** - Not passwords for EC2 access
7. ✅ **Enable Branch Protection** - Require reviews before deployment to master

## Manual Deployment (if needed)

If the pipeline fails, you can deploy manually:

```bash
# On your local machine
ssh -i your-ec2-key.pem ubuntu@your-ec2-ip << 'EOF'
  cd /opt/juzbuild-background-processor
  git pull origin master
  docker-compose down
  docker pull ghcr.io/Button-20/juzbuild-background-processor:latest
  docker-compose up -d
  sleep 10
  curl http://localhost:3001/health
EOF
```

## Next Steps

1. ✅ Add secrets to GitHub
2. ✅ Prepare EC2 instance (install Docker, create .env)
3. ✅ Test pipeline with `git push origin master`
4. ✅ Monitor Actions tab for build and deploy
5. ✅ Verify service running on EC2 with `curl http://your-ec2-ip:3001/health`

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build and Push Action](https://github.com/docker/build-push-action)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
