#!/bin/bash
# User Data Script for BestCity EC2 Instance

set -e

# Update system
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install required packages
echo "Installing required packages..."
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    wget

# Install Docker
echo "Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker ubuntu

# Install Docker Compose
echo "Installing Docker Compose..."
DOCKER_COMPOSE_VERSION="v2.23.0"
curl -L "https://github.com/docker/compose/releases/download/$${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Create application directory
echo "Setting up application directory..."
mkdir -p /opt/bestcity
cd /opt/bestcity

# Clone repository
echo "Cloning BestCity repository..."
git clone https://github.com/elpasticho/best-city-devops-task-.git .

# Create environment file
cat > .env << EOF
NODE_ENV=${environment}
PORT=4000
MONGO_URI=mongodb://mongodb:27017/bestcity
JWT_SECRET=change_this_in_production_via_secrets_manager
JWT_EXPIRE=7d
FRONTEND_URL=http://$$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):4000
METRICS_ENABLED=true
METRICS_PORT=9090
LOG_LEVEL=info
EOF

# Build and start the application with Docker Compose
echo "Building and starting BestCity application..."
docker-compose up -d --build

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 30

# Check if services are running
docker-compose ps

# Create a systemd service for Docker Compose
cat > /etc/systemd/system/bestcity.service << EOF
[Unit]
Description=BestCity Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/bestcity
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
systemctl daemon-reload
systemctl enable bestcity.service

# Configure firewall
echo "Configuring UFW firewall..."
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 4000/tcp
ufw allow 9090/tcp

# Install monitoring agents (optional)
echo "Setting up monitoring..."
# Add your monitoring agents here (CloudWatch, Datadog, etc.)

# Setup log rotation
cat > /etc/logrotate.d/bestcity << EOF
/opt/bestcity/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0644 ubuntu ubuntu
}
EOF

# Create a deployment script for easy updates
cat > /usr/local/bin/deploy-bestcity << 'EOF'
#!/bin/bash
cd /opt/bestcity
docker-compose pull
docker-compose down
docker-compose up -d
docker system prune -f
EOF

chmod +x /usr/local/bin/deploy-bestcity

echo "User data script completed successfully!"
echo "BestCity infrastructure is ready."
