# Terraform Outputs for BestCity Infrastructure

output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.app.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.app.public_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.app.public_dns
}

output "elastic_ip" {
  description = "Elastic IP address (if enabled)"
  value       = var.use_elastic_ip ? aws_eip.app[0].public_ip : null
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.app_sg.id
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = data.aws_vpc.existing.id
}

output "subnet_id" {
  description = "ID of the public subnet"
  value       = data.aws_subnet.existing_public.id
}

output "ssh_connection" {
  description = "SSH connection string"
  value       = "ssh -i ~/.ssh/bestcity-key ubuntu@${var.use_elastic_ip ? aws_eip.app[0].public_ip : aws_instance.app.public_ip}"
}

output "application_url" {
  description = "URL to access the application"
  value       = "http://${var.use_elastic_ip ? aws_eip.app[0].public_ip : aws_instance.app.public_ip}:4000"
}

output "prometheus_url" {
  description = "URL to access Prometheus"
  value       = "http://${var.use_elastic_ip ? aws_eip.app[0].public_ip : aws_instance.app.public_ip}:9090"
}
