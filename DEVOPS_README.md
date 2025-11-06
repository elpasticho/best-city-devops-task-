# BestCity DevOps Setup Guide

This guide covers the complete DevOps infrastructure for the BestCity application including Docker, Terraform, logging, and monitoring.

## Quick Start

### Local Development with Docker

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env with your configuration
vim .env

# 3. Start all services
docker-compose up -d

# 4. Check status
docker-compose ps

# 5. View logs
docker-compose logs -f app
```

**Access Points:**
- Application: http://localhost:4000
- Prometheus: http://localhost:9090
- Health Check: http://localhost:4000/health
- Metrics: http://localhost:4000/metrics

### AWS Deployment with Terraform

```bash
# 1. Navigate to terraform directory
cd terraform

# 2. Configure your variables
cp terraform.tfvars.example terraform.tfvars
vim terraform.tfvars

# 3. Initialize Terraform
terraform init

# 4. Preview changes
terraform plan

# 5. Deploy infrastructure
terraform apply

# 6. Get connection details
terraform output
```

## Features Implemented

### ✅ Docker & Containerization
- **Dockerfile**: Multi-stage build for optimized production images
- **docker-compose.yml**: Full stack orchestration (App + MongoDB + Prometheus)
- **Health Checks**: Automatic container health monitoring
- **Volumes**: Persistent data storage for MongoDB and logs

### ✅ Infrastructure as Code
- **Terraform**: Complete AWS infrastructure provisioning
- **EC2 Instance**: Ubuntu 22.04 with Docker pre-installed
- **VPC & Networking**: Secure network configuration
- **Security Groups**: Controlled access to services
- **Elastic IP**: Optional static IP address

### ✅ Logging
- **Winston**: Structured logging with multiple outputs
- **Log Rotation**: Daily rotation with 14-day retention
- **Log Levels**: error, warn, info, debug
- **Morgan**: HTTP request logging
- **Persistent Storage**: Logs saved to `/logs` directory

### ✅ Monitoring & Metrics
- **Prometheus**: Full metrics collection and visualization
- **Custom Metrics**: Application-specific business metrics
- **Health Endpoint**: `/health` for container orchestration
- **Metrics Endpoint**: `/metrics` for Prometheus scraping
- **System Metrics**: CPU, memory, garbage collection

## Project Structure

```
devops_test/
├── Dockerfile                 # Container image definition
├── docker-compose.yml         # Multi-container orchestration
├── .dockerignore             # Docker build exclusions
├── .env.example              # Environment variables template
├── prometheus.yml            # Prometheus configuration
├── logs/                     # Application logs (Winston)
│   ├── app-*.log
│   ├── error-*.log
│   └── combined-*.log
├── server/
│   └── config/
│       ├── logger.js         # Winston configuration
│       ├── metrics.js        # Prometheus metrics
│       └── database.js       # MongoDB with logging & metrics
└── terraform/                # Infrastructure as Code
    ├── main.tf              # AWS resource definitions
    ├── variables.tf         # Input variables
    ├── outputs.tf           # Output values
    ├── user-data.sh         # EC2 initialization script
    └── README.md            # Terraform documentation
```

## Available Commands

### Docker Commands

```bash
# Start all services in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f app
docker-compose logs -f mongodb
docker-compose logs -f prometheus

# Restart a service
docker-compose restart app

# Rebuild and start
docker-compose up -d --build

# Check service status
docker-compose ps

# Clean up everything (including volumes)
docker-compose down -v
```

### Terraform Commands

```bash
# Initialize (first time only)
terraform init

# Format configuration files
terraform fmt

# Validate configuration
terraform validate

# Preview changes
terraform plan

# Apply changes
terraform apply

# Show current state
terraform show

# View outputs
terraform output

# Destroy infrastructure
terraform destroy
```

### Logging Commands

```bash
# View all logs in real-time
tail -f logs/combined-*.log

# View error logs only
tail -f logs/error-*.log

# View application logs
tail -f logs/app-*.log

# Search logs for errors
grep "error" logs/combined-*.log

# View Docker container logs
docker logs -f bestcity-app

# View logs with timestamps
docker logs -f --timestamps bestcity-app
```

### Monitoring Commands

```bash
# Check application health
curl http://localhost:4000/health

# Get Prometheus metrics
curl http://localhost:4000/metrics

# Access Prometheus UI
open http://localhost:9090
```

## Environment Variables

Required environment variables in `.env`:

```env
# Server Configuration
PORT=4000
NODE_ENV=production

# Database
MONGO_URI=mongodb://mongodb:27017/bestcity

# Security
JWT_SECRET=your-secure-secret-key

# CORS
FRONTEND_URL=http://localhost:4000

# Logging
LOG_LEVEL=info

# Metrics
METRICS_ENABLED=true
```

## Metrics Available

### System Metrics
- `process_cpu_user_seconds_total` - CPU usage
- `nodejs_heap_size_total_bytes` - Memory usage
- `nodejs_gc_duration_seconds` - Garbage collection

### HTTP Metrics
- `bestcity_http_requests_total` - Request counter
- `bestcity_http_request_duration_seconds` - Request duration
- `bestcity_active_connections` - Active connections

### Database Metrics
- `bestcity_db_connection_status` - DB status (1=connected, 0=disconnected)
- `bestcity_db_query_duration_seconds` - Query duration

### Application Metrics
- `bestcity_notes_created_total` - Notes created
- `bestcity_notes_deleted_total` - Notes deleted
- `bestcity_notes_updated_total` - Notes updated
- `bestcity_notes_retrieved_total` - Notes retrieved
- `bestcity_errors_total` - Errors by type and route

## Troubleshooting

### Docker Issues

**Problem: Port already in use**
```bash
# Find and kill process using port 4000
lsof -i :4000
kill -9 <PID>
```

**Problem: Container won't start**
```bash
# Check logs
docker-compose logs app

# Rebuild without cache
docker-compose build --no-cache app
docker-compose up -d
```

**Problem: MongoDB connection failed**
```bash
# Check MongoDB is running
docker ps | grep mongodb

# Restart MongoDB
docker-compose restart mongodb

# Check MongoDB logs
docker-compose logs mongodb
```

### Terraform Issues

**Problem: AWS credentials not configured**
```bash
# Configure AWS CLI
aws configure

# Or export credentials
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
```

**Problem: State locked**
```bash
# Force unlock (use with caution)
terraform force-unlock <lock-id>
```

### Logging Issues

**Problem: No logs appearing**
```bash
# Check directory permissions
ls -la logs/

# Create directory if missing
mkdir -p logs

# Check LOG_LEVEL in .env
grep LOG_LEVEL .env

# Set to debug for verbose logging
LOG_LEVEL=debug docker-compose restart app
```

## Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Restrict SSH access** - Update `allowed_ssh_cidr` in Terraform
3. **Use strong secrets** - Generate secure JWT_SECRET
4. **Enable HTTPS** - Use SSL/TLS certificates in production
5. **Regular updates** - Keep dependencies and base images updated
6. **Backup data** - Regular MongoDB backups
7. **Monitor logs** - Check error logs regularly

## Cost Estimate (AWS)

Monthly costs for production deployment:
- **EC2 t3.medium**: ~$30/month
- **EBS 30GB**: ~$3/month
- **Elastic IP**: ~$3.60/month
- **Data Transfer**: Variable
- **Total**: ~$37-40/month + data transfer

## Next Steps

1. **CI/CD Pipeline**: Add GitHub Actions or Jenkins
2. **Load Balancer**: Add ALB for high availability
3. **Auto Scaling**: Configure EC2 Auto Scaling Groups
4. **Managed Database**: Migrate to MongoDB Atlas or AWS DocumentDB
5. **CDN**: Add CloudFront for static assets
6. **Monitoring**: Add Grafana for visualization
7. **Alerting**: Configure Prometheus alerts
8. **Backups**: Automated database backups
9. **SSL/TLS**: HTTPS with Let's Encrypt

## Documentation

- **Terraform Guide**: `terraform/README.md`
- **API Documentation**: `docs/API.md`
- **Architecture Guide**: `docs/ARCHITECTURE.md`
- **Changelog**: `docs/CHANGELOG.md`
- **CLAUDE.md**: Development guide for Claude Code

## Support

For issues or questions:
1. Check the documentation in `/docs` folder
2. Review logs in `/logs` directory
3. Check metrics at `/metrics` endpoint
4. Review CHANGELOG.md for recent changes

---

**Last Updated**: 2025-11-06
**Version**: 1.4.0
**Maintainer**: DevOps Team
