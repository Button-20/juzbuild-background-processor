# Complete Setup Checklist - Docker + GitHub Actions + EC2

Follow this checklist in order. Each item should be completed before moving to the next.

## Phase 1: EC2 Instance Preparation (10 minutes)

- [ ] **1.1** SSH into your AWS EC2 Ubuntu instance

  ```powershell
  ssh -i your-ec2-key.pem ubuntu@your-ec2-ip
  ```

- [ ] **1.2** Run the setup script on EC2

  ```bash
  curl -fsSL https://raw.githubusercontent.com/Button-20/juzbuild-background-processor/master/setup-ec2.sh | bash
  ```

- [ ] **1.3** Update `.env` file on EC2

  ```bash
  nano /opt/juzbuild-background-processor/.env
  ```

  Update these critical variables:

  - `MONGODB_URI` - Your MongoDB connection string
  - `REDIS_URL` - Your Redis connection URL
  - `GITHUB_TOKEN` - Your GitHub personal access token
  - `VERCEL_TOKEN` - Your Vercel API token
  - `NAMECHEAP_API_KEY` - Your Namecheap API key
  - `NAMECHEAP_CLIENT_IP` - Your EC2 static IP address
  - `BACKGROUND_PROCESSOR_SECRET` - Any random string (make it secure)
  - `JUZBUILD_RESEND_API_KEY` - Your Resend API key
  - `GOOGLE_ANALYTICS_ACCOUNT_ID` - Your Google Analytics ID

- [ ] **1.4** Verify the setup
  ```bash
  cat /opt/juzbuild-background-processor/.env | head -10
  exit
  ```

## Phase 2: SSH Key Generation (10 minutes)

- [ ] **2.1** Generate SSH key pair on local machine (PowerShell)

  ```powershell
  cd $HOME
  ssh-keygen -t rsa -b 4096 -f ec2-github-actions -C "github-actions" -N ""
  ```

- [ ] **2.2** Verify keys were created

  ```powershell
  ls ec2-github-actions*
  # Should show: ec2-github-actions and ec2-github-actions.pub
  ```

- [ ] **2.3** Add public key to EC2 (PowerShell)

  ```powershell
  $EC2_IP = "your-ec2-ip"
  $KEY_PATH = "your-ec2-key.pem-path"
  $PUB_KEY = Get-Content "$HOME\ec2-github-actions.pub"
  ssh -i $KEY_PATH ubuntu@$EC2_IP "echo '$PUB_KEY' >> ~/.ssh/authorized_keys; chmod 600 ~/.ssh/authorized_keys"
  ```

- [ ] **2.4** Test SSH access with new key (PowerShell)
  ```powershell
  ssh -i "$HOME\ec2-github-actions" ubuntu@$EC2_IP "echo 'SSH works!'"
  # Should output: SSH works!
  ```

## Phase 3: GitHub Secrets Configuration (5 minutes)

- [ ] **3.1** Copy EC2 private key to clipboard

  ```powershell
  Get-Content "$HOME\ec2-github-actions" -Raw | Set-Clipboard
  Write-Host "Private key copied!"
  ```

- [ ] **3.2** Go to GitHub Secrets

  - Open: https://github.com/Button-20/juzbuild-background-processor/settings/secrets/actions
  - Click "New repository secret"

- [ ] **3.3** Add Secret #1: EC2_PRIVATE_KEY

  - **Name:** `EC2_PRIVATE_KEY`
  - **Value:** Paste from clipboard (entire private key)
  - Click "Add secret"

- [ ] **3.4** Add Secret #2: EC2_USER

  - **Name:** `EC2_USER`
  - **Value:** `ubuntu`
  - Click "Add secret"

- [ ] **3.5** Add Secret #3: EC2_HOST

  - **Name:** `EC2_HOST`
  - **Value:** Your EC2 static IP (e.g., `54.123.45.67`)
  - Click "Add secret"

- [ ] **3.6** Verify all 3 secrets appear
  - Go to https://github.com/Button-20/juzbuild-background-processor/settings/secrets/actions
  - Should see: EC2_HOST, EC2_PRIVATE_KEY, EC2_USER (all show as masked values)

## Phase 4: Local Repository Verification (5 minutes)

- [ ] **4.1** Navigate to local repository

  ```powershell
  cd "C:\Path\To\juzbuild-background-processor"
  ```

- [ ] **4.2** Verify you're on master branch

  ```powershell
  git branch
  # Should show: * master
  ```

- [ ] **4.3** Verify workflow file exists

  ```powershell
  Test-Path ".github\workflows\deploy.yml"
  # Should output: True
  ```

- [ ] **4.4** Verify Dockerfile exists

  ```powershell
  Test-Path "Dockerfile"
  # Should output: True
  ```

- [ ] **4.5** Verify docker-compose.yml exists

  ```powershell
  Test-Path "docker-compose.yml"
  # Should output: True
  ```

- [ ] **4.6** Verify setup script exists
  ```powershell
  Test-Path "setup-ec2.sh"
  # Should output: True
  ```

## Phase 5: First Deployment Trigger (5 minutes)

- [ ] **5.1** Commit any pending changes

  ```powershell
  git add -A
  git commit -m "Deploy: Docker on EC2 with GitHub Actions"
  ```

- [ ] **5.2** Push to trigger GitHub Actions

  ```powershell
  git push origin master
  ```

- [ ] **5.3** Monitor GitHub Actions
  - Open: https://github.com/Button-20/juzbuild-background-processor/actions
  - Click on the latest workflow run
  - Watch the build job (should take 2-3 minutes)
  - Wait for deploy job to start

## Phase 6: Verify Deployment (10 minutes)

- [ ] **6.1** Check GitHub Actions dashboard

  - Should show: "build" job completed ✅
  - Should show: "deploy" job running or completed

- [ ] **6.2** SSH into EC2 to check status

  ```powershell
  ssh -i "$HOME\ec2-github-actions" ubuntu@$EC2_IP
  ```

- [ ] **6.3** Check Docker container status (on EC2)

  ```bash
  cd /opt/juzbuild-background-processor
  docker-compose ps
  # Should show background-processor as "Up"
  ```

- [ ] **6.4** Check service logs (on EC2)

  ```bash
  docker-compose logs background-processor
  # Should show app startup messages
  ```

- [ ] **6.5** Test health endpoint (on EC2)

  ```bash
  curl http://localhost:3001/health
  # Should return JSON with status
  ```

- [ ] **6.6** Exit EC2
  ```bash
  exit
  ```

## Phase 7: Verify Automatic Deployment (5 minutes)

- [ ] **7.1** Make a test change locally

  ```powershell
  echo "# Test deployment $(Get-Date)" >> README.md
  ```

- [ ] **7.2** Commit and push

  ```powershell
  git add README.md
  git commit -m "Test: trigger automatic deployment"
  git push origin master
  ```

- [ ] **7.3** Monitor GitHub Actions

  - Open: https://github.com/Button-20/juzbuild-background-processor/actions
  - Should see new workflow run starting
  - Build should complete in 1-2 minutes
  - Deploy should run and complete

- [ ] **7.4** Verify on EC2
  ```powershell
  ssh -i "$HOME\ec2-github-actions" ubuntu@$EC2_IP "curl http://localhost:3001/health"
  # Should return 200 OK with health status
  exit
  ```

## Phase 8: Security Hardening (Optional, but recommended)

- [ ] **8.1** Regenerate SSH key

  - Mark old key as compromised in your key manager
  - Plan to rotate in 90 days

- [ ] **8.2** Restrict EC2 Security Group

  - Allow SSH only from your IP
  - Allow HTTP/HTTPS from your application IPs

- [ ] **8.3** Enable GitHub Actions audit logs

  - Go to repository settings
  - Check for any suspicious deployments

- [ ] **8.4** Rotate API keys periodically
  - Plan to rotate every 90 days
  - Use AWS Secrets Manager for production

## Troubleshooting Checklist

If something fails, work through these items:

### Build Fails

- [ ] Check workflow file: `.github/workflows/deploy.yml` exists
- [ ] Check Dockerfile exists and has no syntax errors
- [ ] Verify `docker-compose.yml` has no YAML errors
- [ ] Check all source files are committed to git
- [ ] Ensure `package.json` and `tsconfig.json` exist

### Deploy Fails

- [ ] Verify all 3 GitHub Secrets are set correctly
- [ ] Test SSH manually:
  ```powershell
  ssh -i "$HOME\ec2-github-actions" ubuntu@$EC2_IP "echo test"
  ```
- [ ] Check EC2 security group allows SSH on port 22
- [ ] Verify public key is on EC2: `ssh ubuntu@ip "cat ~/.ssh/authorized_keys | wc -l"`
- [ ] Ensure EC2 has internet access (needed for Docker pull)

### Service Not Running After Deploy

- [ ] SSH to EC2 and check logs: `docker-compose logs`
- [ ] Verify `.env` file exists and has correct values: `cat .env | head`
- [ ] Check MongoDB connection: `curl http://localhost:3001/health`
- [ ] Restart service: `docker-compose restart`
- [ ] Check disk space: `df -h`
- [ ] Check Docker daemon: `docker ps`

### Health Check Fails

- [ ] Wait 30 seconds for service to fully start
- [ ] Check logs: `docker-compose logs -f`
- [ ] Verify port 3001 is not blocked: `curl http://localhost:3001/health`
- [ ] Check environment variables: `cat .env | grep MONGODB`
- [ ] Verify MongoDB is accessible from EC2

## Success Criteria

✅ You have completed this checklist when:

1. ✅ GitHub Actions workflow file exists and is valid
2. ✅ All 3 GitHub Secrets are configured
3. ✅ EC2 instance has Docker, Docker Compose, and Git installed
4. ✅ EC2 has `.env` file with all required variables
5. ✅ SSH key-based authentication works
6. ✅ First deployment succeeded (build + deploy jobs both green)
7. ✅ Health endpoint returns 200 OK from EC2
8. ✅ Automatic deployment works (push triggers pipeline)

## Next Steps

After completing this checklist:

1. **Make code changes locally**

   ```powershell
   # Edit your code
   code src/server.ts
   ```

2. **Test locally**

   ```powershell
   npm run dev
   ```

3. **Commit and push**

   ```powershell
   git add src/server.ts
   git commit -m "Add feature: XYZ"
   git push origin master
   ```

4. **GitHub Actions automatically**:

   - Builds Docker image
   - Pushes to registry
   - Deploys to EC2
   - Verifies health check

5. **Your changes are live!**

## Support Resources

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Docker Docs:** https://docs.docker.com/
- **AWS EC2 Docs:** https://docs.aws.amazon.com/ec2/
- **Repository Issues:** https://github.com/Button-20/juzbuild-background-processor/issues

---

**Time Estimate:** ~1 hour total for full setup

**Status:** Ready to begin! ✅
