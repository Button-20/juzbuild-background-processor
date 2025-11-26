# SSL Setup Helper for Windows
# This script helps you configure SSL on your EC2 instance from Windows

param(
    [Parameter(Mandatory = $true)]
    [string]$Domain,
    
    [Parameter(Mandatory = $true)]
    [string]$Email,
    
    [Parameter(Mandatory = $true)]
    [string]$EC2IP,
    
    [Parameter(Mandatory = $true)]
    [string]$KeyPath
)

Write-Host "🔒 JuzBuild Background Processor - SSL Setup Helper" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Validate parameters
if (!(Test-Path $KeyPath)) {
    Write-Host "❌ SSH key not found at: $KeyPath" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "   Domain: $Domain"
Write-Host "   Email: $Email"
Write-Host "   EC2 IP: $EC2IP"
Write-Host "   SSH Key: $KeyPath"
Write-Host ""

# Test SSH connection
Write-Host "🔌 Testing SSH connection..." -ForegroundColor Yellow
try {
    ssh -i $KeyPath -o StrictHostKeyChecking=no ubuntu@$EC2IP "echo 'SSH connection successful'" 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ SSH connection failed. Check your key and IP address." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ SSH connection successful" -ForegroundColor Green
}
catch {
    Write-Host "❌ SSH connection error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 1: Update DNS (manual reminder)
Write-Host "📝 Step 1: Update DNS Records" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: Update your domain's DNS records BEFORE continuing!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Go to your domain registrar (Namecheap, GoDaddy, etc.) and add:"
Write-Host ""
Write-Host "  A Record:"
Write-Host "  Name: $($Domain.Split('.')[0])  (or leave blank for root domain)"
Write-Host "  Type: A"
Write-Host "  Value: $EC2IP"
Write-Host "  TTL: 3600"
Write-Host ""
Write-Host "Then wait 5-10 minutes for DNS to propagate." -ForegroundColor Yellow
Write-Host ""

$response = Read-Host "Have you updated DNS records and waited 5-10 minutes? (yes/no)"
if ($response -ne "yes") {
    Write-Host "❌ Please update DNS records first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Test DNS resolution
Write-Host "🔍 Step 2: Verifying DNS Resolution" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Testing DNS resolution for $Domain..." -ForegroundColor Yellow

$maxRetries = 3
$retryCount = 0
$dnsResolved = $false

while ($retryCount -lt $maxRetries -and -not $dnsResolved) {
    try {
        $ipAddress = [System.Net.Dns]::GetHostAddresses($Domain)[0].IPAddressToString
        if ($ipAddress -eq $EC2IP) {
            Write-Host "✅ DNS resolved correctly: $Domain → $ipAddress" -ForegroundColor Green
            $dnsResolved = $true
        }
        else {
            Write-Host "⚠️  DNS resolved but IP doesn't match. Expected: $EC2IP, Got: $ipAddress" -ForegroundColor Yellow
            $retryCount++
            if ($retryCount -lt $maxRetries) {
                Write-Host "   Retrying in 30 seconds..." -ForegroundColor Yellow
                Start-Sleep -Seconds 30
            }
        }
    }
    catch {
        Write-Host "⚠️  DNS not yet resolved. Retrying in 30 seconds..." -ForegroundColor Yellow
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Start-Sleep -Seconds 30
        }
    }
}

if (-not $dnsResolved) {
    Write-Host "❌ DNS resolution failed. Please verify your DNS records." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Run SSL setup script
Write-Host "🚀 Step 3: Running SSL Setup on EC2" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Running: setup-ssl.sh $Domain $Email" -ForegroundColor Yellow
Write-Host ""

# Run the setup script via SSH
$sshCommand = @"
curl -fsSL https://raw.githubusercontent.com/Button-20/juzbuild-background-processor/master/setup-ssl.sh | bash -s -- $Domain $Email
"@

ssh -i $KeyPath -o StrictHostKeyChecking=no ubuntu@$EC2IP $sshCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ SSL setup completed successfully!" -ForegroundColor Green
}
else {
    Write-Host ""
    Write-Host "❌ SSL setup failed. See errors above." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 4: Verify SSL
Write-Host "✅ Step 4: Verifying HTTPS Connection" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Testing HTTPS connection to https://$Domain/health..." -ForegroundColor Yellow

$maxRetries = 3
$retryCount = 0
$sslWorking = $false

while ($retryCount -lt $maxRetries -and -not $sslWorking) {
    try {
        $response = Invoke-WebRequest -Uri "https://$Domain/health" -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ HTTPS connection successful!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Response:" -ForegroundColor Yellow
            Write-Host $response.Content
            $sslWorking = $true
        }
    }
    catch {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Write-Host "⏳ Connection attempt $retryCount failed, retrying in 10 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 10
        }
        else {
            Write-Host "❌ HTTPS verification failed after $maxRetries attempts" -ForegroundColor Red
            Write-Host "   Try manually: curl https://$Domain/health -v" -ForegroundColor Yellow
        }
    }
}

Write-Host ""

# Step 5: Summary and next steps
Write-Host "✅ SSL Setup Complete!" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host ""

Write-Host "📊 Certificate Information:" -ForegroundColor Cyan
Write-Host "   Domain: $Domain"
Write-Host "   Certificate Authority: Let's Encrypt"
Write-Host "   Valid for: 90 days"
Write-Host "   Auto-Renewal: Enabled"
Write-Host ""

Write-Host "🔗 Your URLs:" -ForegroundColor Cyan
Write-Host "   HTTP:  http://$Domain (redirects to HTTPS)"
Write-Host "   HTTPS: https://$Domain"
Write-Host "   Health: https://$Domain/health"
Write-Host ""

Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Update your main app's .env.local:"
Write-Host "      BACKGROUND_PROCESSOR_URL=https://$Domain"
Write-Host ""
Write-Host "   2. Test the connection from your main app"
Write-Host ""
Write-Host "   3. Monitor certificate expiration:"
Write-Host "      ssh -i $KeyPath ubuntu@$EC2IP"
Write-Host "      sudo certbot certificates"
Write-Host ""

Write-Host "✨ Your background processor is now production-ready with SSL/TLS!" -ForegroundColor Green
Write-Host ""
