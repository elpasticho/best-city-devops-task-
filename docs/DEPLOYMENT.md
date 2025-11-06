# BestCity Deployment Guide

## Overview

This guide covers deployment strategies for the BestCity real estate investment platform using Docker, Docker Compose, and Terraform for AWS infrastructure provisioning.

## Prerequisites

### Required Software
- Node.js 20.x
- npm 10.x or higher
- Docker & Docker Compose (for containerized deployment)
- Terraform >= 1.0 (for AWS deployment)
- Git
- AWS CLI (configured with credentials)

### Required Accounts
- GitHub account (for code repository)
- AWS account (for cloud deployment)
- MongoDB (local or Atlas for database)

## Environment Variables

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=4000
NODE_ENV=production

# Database
MONGO_URI=mongodb://mongodb:27017/bestcity

# Security
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=7d

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key

# Frontend
FRONTEND_URL=http://your-domain.com
VITE_API_BASE_URL=http://localhost:4000/api/v1

# Logging
LOG_LEVEL=info
DISABLE_FILE_LOGGING=true  # true for Docker/production

# Monitoring
METRICS_ENABLED=true
METRICS_PORT=9090
```

---

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/elpasticho/best-city-devops-task-.git
cd best-city-devops-task-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start MongoDB (if running locally)
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

### 4. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 5. Run Development Server
```bash
npm start
# or
npm run dev
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/v1
- Health Check: http://localhost:4000/health
- Metrics: http://localhost:4000/metrics

---

## Docker Deployment (Recommended)

### Architecture

```
docker-compose.yml orchestrates:
├── bestcity-app (Application)
│   ├── Frontend (built static files)
│   ├── Backend (Express.js)
│   └── Port: 4000
├── bestcity-mongodb (Database)
│   ├── MongoDB 7.0
│   └── Port: 27017
└── bestcity-prometheus (Monitoring)
    ├── Prometheus metrics server
    └── Port: 9090
```

### Build Process

**Multi-Stage Dockerfile:**
1. **Stage 1 (Frontend Builder):**
   - Installs all dependencies (including dev)
   - Builds frontend with Vite → `/build` directory
   - Output: Optimized static assets

2. **Stage 2 (Production Image):**
   - Installs production dependencies only
   - Copies server code
   - Copies built frontend from Stage 1
   - Final image size: ~150MB

### Quick Start

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit environment variables
vim .env

# 3. Build and start all services
docker-compose up -d --build

# 4. Check container status
docker-compose ps

# 5. View logs
docker-compose logs -f app
```

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild specific service
docker-compose up -d --build app

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f app
docker-compose logs -f mongodb
docker-compose logs -f prometheus

# Restart service
docker-compose restart app

# Check service health
docker ps
docker inspect bestcity-app --format='{{.State.Health.Status}}'

# Clean up (WARNING: removes volumes/data)
docker-compose down -v
```

### Access Points

Once deployed:
- **Application**: http://localhost:4000
- **Health Check**: http://localhost:4000/health
- **Metrics**: http://localhost:4000/metrics
- **Prometheus UI**: http://localhost:9090
- **MongoDB**: mongodb://localhost:27017

### Troubleshooting Docker

**Issue: Container keeps restarting**
```bash
# Check logs
docker logs bestcity-app

# Check MongoDB connection
docker exec -it bestcity-app curl http://localhost:4000/health
```

**Issue: Port already in use**
```bash
# Find process
lsof -i :4000

# Kill process
kill -9 <PID>
```

**Issue: Build fails**
```bash
# Clean build
docker-compose down
docker system prune -a
docker-compose up -d --build
```

---

## AWS EC2 Deployment with Terraform

### Infrastructure Overview

**Terraform Provisions:**
- **VPC**: Reuses existing DocuSrchV2 VPC (10.0.0.0/16)
- **Subnet**: Public subnet in us-west-1a (10.0.1.0/24)
- **Security Group**: Ports 22, 80, 443, 4000, 9090
- **EC2 Instance**: t3.small with Ubuntu 22.04
- **Elastic IP**: Static public IP address
- **SSH Key Pair**: For secure access

### Prerequisites

1. **AWS Credentials**
```bash
# Configure AWS CLI
aws configure --profile Docusrch

# Or export credentials
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
export AWS_DEFAULT_REGION="us-west-1"
```

2. **SSH Key Pair**
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/bestcity-key
```

### Deployment Steps

#### 1. Configure Terraform Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:
```hcl
# AWS Configuration
aws_region  = "us-west-1"
aws_profile = "Docusrch"
environment = "production"

# Project Configuration
project_name = "bestcity"

# Network Configuration
vpc_id    = "vpc-021b756da1877a360"      # DocuSrchV2 VPC
subnet_id = "subnet-0dbe41358d196b637"   # Public Subnet

# EC2 Configuration
instance_type = "t3.small"

# SSH Configuration
ssh_public_key = "ssh-ed25519 AAAA... your-public-key-here"

# Security
allowed_ssh_cidr = ["YOUR_IP/32"]  # Restrict to your IP!

# Infrastructure Options
use_elastic_ip = true

# Application Configuration
mongo_uri  = "mongodb://mongodb:27017/bestcity"
jwt_secret = "your-very-secure-jwt-secret-here"
```

#### 2. Initialize Terraform

```bash
terraform init
```

#### 3. Preview Infrastructure Changes

```bash
terraform plan
```

Review the plan carefully before applying.

#### 4. Deploy Infrastructure

```bash
terraform apply
```

Type `yes` to confirm and create the infrastructure.

#### 5. Get Deployment Information

```bash
terraform output
```

**Outputs include:**
- `instance_public_ip`: Public IP address
- `elastic_ip`: Static Elastic IP (if enabled)
- `ssh_connection`: SSH connection string
- `application_url`: Application URL
- `prometheus_url`: Prometheus dashboard URL

### What Happens Automatically

The `user-data.sh` script automatically:
1. ✅ Updates system packages
2. ✅ Installs Docker & Docker Compose
3. ✅ Clones GitHub repository
4. ✅ Creates `.env` file with production configuration
5. ✅ Runs `docker-compose up -d --build`
6. ✅ Configures UFW firewall
7. ✅ Sets up log rotation
8. ✅ Creates systemd service for auto-start

**Total setup time**: ~10-15 minutes

### SSH into EC2 Instance

```bash
ssh -i ~/.ssh/bestcity-key ubuntu@<instance-ip>

# Or use the terraform output
$(terraform output -raw ssh_connection)
```

### Manage Application on EC2

```bash
# SSH into instance
ssh -i ~/.ssh/bestcity-key ubuntu@<instance-ip>

# Navigate to app directory
cd /opt/bestcity

# View Docker containers
sudo docker ps

# View application logs
sudo docker logs -f bestcity-app

# Restart application
sudo docker-compose restart app

# Pull latest code and redeploy
sudo git pull origin main
sudo docker-compose down
sudo docker-compose up -d --build
```

### Update Deployment

```bash
# SSH into EC2
ssh -i ~/.ssh/bestcity-key ubuntu@<instance-ip>

# Update code
cd /opt/bestcity
sudo git pull origin main

# Rebuild and restart
sudo docker-compose down
sudo docker-compose up -d --build
```

### Terraform Management

```bash
# View current infrastructure state
terraform show

# Update infrastructure
terraform apply

# Destroy infrastructure (WARNING: deletes everything)
terraform destroy

# Format Terraform files
terraform fmt

# Validate configuration
terraform validate
```

### Cost Estimation (us-west-1)

Monthly costs for production deployment:
- **EC2 t3.small**: ~$15/month
- **EBS 30GB**: ~$3/month
- **Elastic IP**: ~$3.60/month (if attached)
- **Data Transfer**: Variable

**Total**: ~$21-22/month + data transfer

---

## Production Deployment Checklist

### Pre-Deployment

- [ ] Update all dependencies (`npm audit fix`)
- [ ] Run all tests (`npm run test:run`)
- [ ] Run linter (`npm run lint`)
- [ ] Build locally to test (`npm run build`)
- [ ] Review environment variables
- [ ] Update `.env` with production values
- [ ] Generate strong JWT_SECRET
- [ ] Configure MongoDB connection
- [ ] Test Docker build locally
- [ ] Review security group rules
- [ ] Restrict SSH access (allowed_ssh_cidr)

### Deployment

- [ ] Push code to GitHub
- [ ] Run `terraform plan` and review
- [ ] Run `terraform apply`
- [ ] Wait for EC2 user-data script (~10-15 min)
- [ ] SSH into instance and verify containers
- [ ] Check application health (`curl http://localhost:4000/health`)
- [ ] Test public URL
- [ ] Verify Prometheus metrics
- [ ] Check logs for errors

### Post-Deployment

- [ ] Verify all pages load correctly
- [ ] Test API endpoints
- [ ] Check dark/light mode toggle
- [ ] Verify MongoDB connection
- [ ] Test health check endpoint
- [ ] Verify Prometheus metrics
- [ ] Check container health
- [ ] Monitor logs for errors
- [ ] Test Notes API (CRUD operations)
- [ ] Verify SSL/TLS (if configured)
- [ ] Set up monitoring alerts
- [ ] Configure backups

---

## Monitoring & Health Checks

### Health Endpoint

```bash
# Check application health
curl http://your-domain.com:4000/health

# Response
{
  "status": "healthy",
  "timestamp": "2025-11-06T20:37:33.505Z",
  "uptime": 67.519,
  "environment": "production"
}
```

### Prometheus Metrics

```bash
# Access metrics endpoint
curl http://your-domain.com:4000/metrics

# Access Prometheus UI
open http://your-domain.com:9090
```

### Logs

```bash
# Docker logs
docker logs -f bestcity-app

# Or via docker-compose
docker-compose logs -f app

# System logs
sudo journalctl -u bestcity -f
```

---

## Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run test:run
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to EC2
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          EC2_HOST: ${{ secrets.EC2_HOST }}
        run: |
          echo "$SSH_PRIVATE_KEY" > key.pem
          chmod 600 key.pem
          ssh -i key.pem -o StrictHostKeyChecking=no ubuntu@$EC2_HOST '
            cd /opt/bestcity &&
            sudo git pull origin main &&
            sudo docker-compose down &&
            sudo docker-compose up -d --build
          '
```

---

## Rollback Strategy

### Quick Rollback

```bash
# SSH into EC2
ssh -i ~/.ssh/bestcity-key ubuntu@<instance-ip>

# Navigate to app directory
cd /opt/bestcity

# Revert to previous commit
sudo git log --oneline -5
sudo git reset --hard <previous-commit-hash>

# Rebuild and restart
sudo docker-compose down
sudo docker-compose up -d --build
```

### Using Git Tags

```bash
# Tag stable versions
git tag -a v1.4.0 -m "Production release 1.4.0"
git push origin v1.4.0

# Deploy specific version
cd /opt/bestcity
sudo git fetch --all --tags
sudo git checkout tags/v1.4.0
sudo docker-compose down
sudo docker-compose up -d --build
```

---

## Backup and Restore

### MongoDB Backup

```bash
# Create backup
docker exec bestcity-mongodb mongodump --out /data/backup

# Copy backup from container
docker cp bestcity-mongodb:/data/backup ./mongodb-backup-$(date +%Y%m%d)

# Automated daily backup (cron)
0 2 * * * docker exec bestcity-mongodb mongodump --out /data/backup-$(date +\%Y\%m\%d)
```

### MongoDB Restore

```bash
# Copy backup to container
docker cp ./mongodb-backup bestcity-mongodb:/data/restore

# Restore database
docker exec bestcity-mongodb mongorestore /data/restore
```

---

## Security Best Practices

### 1. SSH Access
```bash
# Restrict SSH to your IP only
allowed_ssh_cidr = ["YOUR_IP/32"]

# Use SSH keys (not passwords)
# Disable password authentication in /etc/ssh/sshd_config
```

### 2. Environment Variables
```bash
# Never commit .env files
# Use AWS Secrets Manager for production
# Rotate JWT_SECRET regularly
```

### 3. Firewall Configuration
```bash
# UFW is configured automatically
# Verify firewall status
sudo ufw status

# Only necessary ports are open:
# - 22 (SSH)
# - 80 (HTTP)
# - 443 (HTTPS)
# - 4000 (Application)
# - 9090 (Prometheus)
```

### 4. SSL/TLS
```bash
# Use Let's Encrypt for free SSL certificates
sudo apt-get install certbot
sudo certbot --nginx -d yourdomain.com
```

### 5. Regular Updates
```bash
# Update system packages
sudo apt-get update && sudo apt-get upgrade

# Update Docker images
docker-compose pull
docker-compose up -d

# Update npm dependencies
npm update
npm audit fix
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check Docker logs
docker logs bestcity-app

# Check MongoDB connection
docker exec -it bestcity-app curl http://localhost:4000/health

# Verify environment variables
docker exec -it bestcity-app env | grep MONGO_URI
```

### MongoDB Connection Issues

```bash
# Check MongoDB container
docker ps | grep mongodb

# Test MongoDB connection
docker exec -it bestcity-mongodb mongosh

# Check MongoDB logs
docker logs bestcity-mongodb
```

### Port Conflicts

```bash
# Find process using port
sudo lsof -i :4000

# Kill process
sudo kill -9 <PID>
```

### Disk Space Issues

```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a
docker volume prune
```

---

## Additional Resources

- **Docker Documentation**: [docker-compose.yml](../docker-compose.yml)
- **Terraform Documentation**: [terraform/README.md](../terraform/README.md)
- **Architecture Documentation**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **API Documentation**: [API.md](./API.md)
- **DevOps Guide**: [DEVOPS_README.md](../DEVOPS_README.md)

---

**Last Updated:** 2025-11-06
**Version:** 1.4.0
**Deployment Status:** ✅ Production Ready
