# GitHub Actions Configuration Guide

This guide explains how to set up GitHub Actions secrets and workflows for the JuzBuild Background Processor.

## Required Secrets Setup

### 1. Vercel Deployment Secrets

Go to: **Repository Settings → Secrets and variables → Actions**

Add the following secrets:

```
VERCEL_TOKEN: <your-vercel-token>
VERCEL_ORG_ID: <your-vercel-organization-id>
VERCEL_PROJECT_ID: <your-background-processor-project-id>
```

**How to get these values:**
- `VERCEL_TOKEN`: From Vercel Dashboard → Settings → Tokens
- `VERCEL_ORG_ID`: From Vercel Dashboard → Settings → General (Team ID)
- `VERCEL_PROJECT_ID`: From your project settings

### 2. EC2 Deployment Secrets

Add for EC2 deployment pipeline:

```
EC2_HOST: <your-ec2-public-or-elastic-ip>
EC2_USERNAME: ec2-user (or ubuntu for Ubuntu AMIs)
EC2_SSH_KEY: <your-private-ssh-key>
```

**How to get these values:**
- `EC2_HOST`: Your EC2 Elastic IP
- `EC2_USERNAME`: Usually `ec2-user` for Amazon Linux, `ubuntu` for Ubuntu
- `EC2_SSH_KEY`: Your `.pem` file content (entire private key)

**To add the SSH key:**
1. Open your `.pem` file
2. Copy the entire content
3. Go to GitHub Secrets
4. Create new secret `EC2_SSH_KEY`
5. Paste the entire key content

### 3. Slack Notifications (Optional)

For deployment notifications:

```
SLACK_WEBHOOK: <your-slack-webhook-url>
```

**How to get this:**
1. Go to https://api.slack.com/apps
2. Create new app or select existing
3. Enable "Incoming Webhooks"
4. Create new webhook for your channel
5. Copy webhook URL

### 4. Docker Registry (GitHub Container Registry)

The pipeline uses GitHub Container Registry (GHCR) which uses your GitHub token automatically.

## Available Workflows

### 1. **CI/CD Pipeline** (`ci-cd.yml`)
Runs on every push and PR:
- ✅ Build and test
- ✅ Docker image build
- ✅ Security scanning
- ✅ Deploy to Vercel (master branch only)

### 2. **Deploy to EC2** (`deploy-ec2.yml`)
Manually triggered or auto-deploy on master:
- ✅ Build Docker image
- ✅ Push to GitHub Container Registry
- ✅ Deploy to EC2 via SSH
- ✅ Health check verification

### 3. **Docker Image Push** (`docker-push.yml`)
On every push to master/dev or tag creation:
- ✅ Build multi-architecture images
- ✅ Push to GitHub Container Registry
- ✅ Tag with branch/version/sha

### 4. **Code Quality** (`code-quality.yml`)
On every push and PR:
- ✅ TypeScript compilation
- ✅ ESLint linting
- ✅ Security audit
- ✅ Dependency checks

### 5. **Release** (`release.yml`)
On version tag creation (e.g., `git tag v1.0.0`):
- ✅ Create GitHub Release
- ✅ Generate changelog
- ✅ Docker image tagged
- ✅ Slack notification

## How to Trigger Deployments

### Automatic Deployments
- **Vercel**: Push to `master` branch (automatic)
- **EC2**: Push to `master` branch or manually trigger

### Manual Deployment to EC2
1. Go to **Actions** tab
2. Select **Deploy to EC2** workflow
3. Click **Run workflow**
4. Select environment (production/staging)
5. Watch the deployment progress

### Create a Release
```bash
# Create and push a version tag
git tag v1.0.0
git push origin v1.0.0
```

This will:
- Create a GitHub Release
- Build and push Docker image with version tag
- Send notification to Slack

## Viewing Workflow Results

1. Go to **Actions** tab in your repository
2. Click on a workflow run to see details
3. Expand individual jobs to view logs
4. Check for failures and their error messages

## Troubleshooting

### Vercel Deployment Fails
- Check `VERCEL_TOKEN` is valid
- Verify `VERCEL_PROJECT_ID` matches your project
- Check Vercel build settings

### EC2 Deployment Fails
- Verify `EC2_HOST` is reachable
- Check `EC2_USERNAME` is correct for your AMI
- Test SSH key manually: `ssh -i key.pem ec2-user@host`
- Verify EC2 has Docker installed

### Docker Image Push Fails
- Check GitHub token permissions
- Verify Docker file is correct
- Check GitHub Container Registry settings

### Code Quality Checks Fail
- Fix TypeScript compilation errors
- Run `npm run build` locally to verify
- Check for syntax errors in source files

## Best Practices

1. **Always test locally before pushing**
   ```bash
   npm run build
   npm run docker:build
   docker-compose up
   ```

2. **Use meaningful commit messages**
   - Helps with changelog generation
   - Makes debugging easier

3. **Tag releases properly**
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

4. **Monitor workflow runs**
   - Check Actions tab after each push
   - Review security scan results
   - Verify deployments succeeded

5. **Keep secrets secure**
   - Never commit `.env` files
   - Never paste secrets in code
   - Rotate tokens periodically
   - Use environment-specific secrets

## Example: Complete Deployment Flow

```bash
# 1. Make changes and test locally
git add .
git commit -m "feat: add new feature"

# 2. Push to master (triggers CI/CD)
git push origin master
# → GitHub Actions runs tests and builds

# 3. Create release when ready
git tag v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
# → Creates GitHub Release
# → Builds Docker image with version tag
# → Sends Slack notification

# 4. Deploy to EC2 (manual or auto)
# Option A: Auto-deploy via ci-cd.yml
# Option B: Manual trigger via deploy-ec2.yml
# → Deploys Docker container to EC2
# → Runs health checks
# → Notifies via Slack

# 5. Monitor logs
curl https://your-ec2-ip:3001/health
docker-compose logs -f background-processor
```

## Security Considerations

1. **GitHub Secrets**
   - Only accessible to workflows
   - Not logged in workflow output
   - Rotate regularly

2. **Docker Images**
   - Pushed to private GitHub Container Registry
   - Requires GitHub authentication to pull
   - Include only necessary files (.dockerignore)

3. **EC2 Security**
   - Use separate SSH key for CI/CD
   - Restrict key permissions
   - Keep EC2 security groups tight
   - Use Elastic IP for consistency

4. **Environment Separation**
   - Use different secrets for dev/prod
   - Tag releases for production
   - Test in staging before production
   - Keep master branch protected

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build & Push Action](https://github.com/docker/build-push-action)
- [appleboy/ssh-action](https://github.com/appleboy/ssh-action)
- [Vercel GitHub Integration](https://vercel.com/docs/git)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
