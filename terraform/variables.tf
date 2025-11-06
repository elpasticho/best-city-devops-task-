# Terraform Variables for BestCity Infrastructure

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-west-1"
}

variable "aws_profile" {
  description = "AWS CLI profile to use"
  type        = string
  default     = "Docusrch"
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "bestcity"
}

variable "vpc_id" {
  description = "Existing VPC ID to use"
  type        = string
}

variable "subnet_id" {
  description = "Existing public subnet ID to use"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.small"
}

variable "ssh_public_key" {
  description = "SSH public key for EC2 access"
  type        = string
  sensitive   = true
}

variable "allowed_ssh_cidr" {
  description = "CIDR blocks allowed to SSH into the instance"
  type        = list(string)
  default     = ["0.0.0.0/0"] # Restrict this in production!
}

variable "use_elastic_ip" {
  description = "Whether to use Elastic IP for static IP address"
  type        = bool
  default     = true
}

variable "mongo_uri" {
  description = "MongoDB connection URI"
  type        = string
  sensitive   = true
  default     = "mongodb://localhost:27017/bestcity"
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}
