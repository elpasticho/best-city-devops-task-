# BestCity Terraform Infrastructure

This directory contains Terraform configuration for provisioning AWS infrastructure for the BestCity application.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) >= 1.0
- AWS CLI configured with appropriate credentials
- SSH key pair for EC2 access

## Infrastructure Components

- **VPC**: Virtual Private Cloud with public subnet
- **EC2 Instance**: Application server (t3.medium by default)
- **Security Group**: Firewall rules for app, SSH, HTTP/HTTPS, Prometheus
- **Elastic IP**: Static IP address (optional)
- **IAM Roles**: For EC2 instance permissions (if needed)

## Quick Start

### 1. Configure Variables

```bash
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your values:
- AWS region
- SSH public key
- Environment name
- Instance type

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Plan Deployment

```bash
terraform plan
```

Review the planned changes before applying.

### 4. Apply Configuration

```bash
terraform apply
```

Type `yes` to confirm and create the infrastructure.

### 5. Get Outputs

```bash
terraform output
```

This will show:
- EC2 instance public IP
- Application URL
- SSH connection string
- Prometheus URL

## Accessing the Instance

### SSH Access

```bash
ssh -i ~/.ssh/bestcity-key ubuntu@<instance-public-ip>
```

### Application Access

- **Application**: http://<instance-public-ip>:4000
- **Prometheus**: http://<instance-public-ip>:9090

## Managing the Infrastructure

### Update Infrastructure

Make changes to `.tf` files and run:

```bash
terraform plan
terraform apply
```

### Destroy Infrastructure

```bash
terraform destroy
```

**Warning**: This will delete all resources. Data will be lost unless backed up.

## Security Best Practices

1. **Restrict SSH Access**: Update `allowed_ssh_cidr` to your IP only
2. **Use Secrets Manager**: Store sensitive values in AWS Secrets Manager
3. **Enable Encryption**: EBS volumes are encrypted by default
4. **Use IAM Roles**: Instead of hardcoded credentials
5. **Enable VPC Flow Logs**: For network monitoring
6. **Use HTTPS**: Configure SSL/TLS certificates (Let's Encrypt)

## Customization

### Change Instance Type

In `terraform.tfvars`:
```hcl
instance_type = "t3.large"
```

### Add Multiple Environments

Create separate `.tfvars` files:
- `production.tfvars`
- `staging.tfvars`
- `development.tfvars`

Apply with:
```bash
terraform apply -var-file=production.tfvars
```

### Use Remote Backend

Add to `main.tf`:
```hcl
terraform {
  backend "s3" {
    bucket = "bestcity-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"
    encrypt = true
  }
}
```

## Troubleshooting

### Issue: Cannot connect to instance

1. Check security group rules
2. Verify SSH key permissions: `chmod 400 ~/.ssh/bestcity-key`
3. Check instance public IP

### Issue: Application not accessible

1. SSH into instance
2. Check Docker status: `sudo docker ps`
3. Check logs: `sudo docker-compose logs -f`
4. Verify security group port 4000 is open

### Issue: Terraform state locked

```bash
terraform force-unlock <lock-id>
```

## Cost Estimation

Approximate monthly costs (us-east-1):
- t3.medium EC2: ~$30/month
- EBS 30GB: ~$3/month
- Elastic IP (if used): ~$3.60/month
- Data transfer: Variable

**Total**: ~$37-40/month (plus data transfer)

## Next Steps

1. Set up CI/CD pipeline
2. Configure auto-scaling
3. Add RDS for MongoDB (instead of containerized)
4. Set up CloudWatch alarms
5. Configure backups
6. Add Load Balancer for high availability
