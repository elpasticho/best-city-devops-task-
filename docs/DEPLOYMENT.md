# BestCity Deployment Guide

## Overview

This guide covers deployment strategies and configurations for the BestCity real estate investment platform across various hosting platforms.

## Prerequisites

### Required Software
- Node.js 20.x.x
- npm 10.x.x or higher
- Git
- MongoDB (for backend)

### Environment Variables

Create a `.env` file in the project root:

```env
# Frontend Environment Variables (prefix with VITE_)
VITE_API_BASE_URL=https://api.bestcity.com
VITE_INFURA_ID=your_infura_project_id
VITE_NETWORK_ID=1
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_id

# Backend Environment Variables
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bestcity
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Email Configuration
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@bestcity.com

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateway
PAYTM_MID=your_merchant_id
PAYTM_KEY=your_merchant_key
PAYTM_WEBSITE=WEBSTAGING

# CORS
FRONTEND_URL=https://bestcity.com
```

## Build Process

### Development Build
```bash
npm run dev
```
Starts:
- Vite dev server on port 3000
- Express backend on port 5000

### Production Build
```bash
npm run build
```
Creates optimized production build in `/build` directory.

### Build Outputs
```
build/
├── index.html          # Entry HTML
├── assets/
│   ├── index-[hash].js    # Main JavaScript bundle
│   ├── index-[hash].css   # Main CSS bundle
│   └── [images/fonts]     # Optimized assets
└── models/            # 3D models
```

## Deployment Options

## Option 1: Vercel (Recommended)

### Advantages
- Zero configuration for Vite projects
- Automatic HTTPS
- Global CDN
- Excellent performance
- Serverless functions support
- Automatic deployments from Git

### Setup Steps

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Configure vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": { "cache-control": "max-age=31536000, immutable" },
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "@api_base_url",
    "VITE_INFURA_ID": "@infura_id"
  }
}
```

4. **Deploy**
```bash
# First deployment
vercel

# Production deployment
vercel --prod
```

5. **Add Environment Variables**
```bash
vercel env add VITE_API_BASE_URL production
vercel env add VITE_INFURA_ID production
```

### Continuous Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Automatic deployments on push to main branch
4. Preview deployments for pull requests

---

## Option 2: Netlify

### Advantages
- Easy setup
- Free SSL certificates
- Form handling
- Serverless functions
- Build plugins

### Setup Steps

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Create netlify.toml**
```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

3. **Deploy**
```bash
# Login
netlify login

# Initialize
netlify init

# Deploy to production
netlify deploy --prod
```

4. **Environment Variables**
- Go to Netlify dashboard
- Site settings → Build & deploy → Environment
- Add variables with VITE_ prefix

---

## Option 3: AWS S3 + CloudFront

### Advantages
- Full control
- Scalable
- Cost-effective for high traffic
- Custom domain support

### Setup Steps

1. **Create S3 Bucket**
```bash
aws s3 mb s3://bestcity-frontend --region us-east-1
```

2. **Configure Bucket for Static Hosting**
```bash
aws s3 website s3://bestcity-frontend \
  --index-document index.html \
  --error-document index.html
```

3. **Bucket Policy**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bestcity-frontend/*"
    }
  ]
}
```

4. **Build and Upload**
```bash
# Build
npm run build

# Upload to S3
aws s3 sync build/ s3://bestcity-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

5. **CloudFront Distribution**
- Create CloudFront distribution
- Origin: S3 bucket endpoint
- Default root object: index.html
- Custom error pages: 404 → /index.html (for SPA routing)
- SSL certificate: Request ACM certificate

6. **Deployment Script**
```bash
#!/bin/bash
# deploy.sh

echo "Building application..."
npm run build

echo "Uploading to S3..."
aws s3 sync build/ s3://bestcity-frontend --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_ID \
  --paths "/*"

echo "Deployment complete!"
```

---

## Option 4: Docker Deployment

### Dockerfile
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (optional)
    location /api/ {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    networks:
      - app-network

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongodb_data:
```

### Build and Run
```bash
# Build image
docker build -t bestcity-frontend .

# Run container
docker run -p 80:80 bestcity-frontend

# Or use docker-compose
docker-compose up -d
```

---

## Option 5: GitHub Pages

### Advantages
- Free hosting
- Automatic deployment from GitHub
- Good for static sites

### Setup Steps

1. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **Add deploy script to package.json**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "homepage": "https://yourusername.github.io/bestcity"
}
```

3. **Configure vite.config.js**
```javascript
export default defineConfig({
  base: '/bestcity/',
  // ... rest of config
});
```

4. **Deploy**
```bash
npm run deploy
```

---

## Backend Deployment

### Option 1: Heroku

1. **Create Procfile**
```
web: node server/server.js
```

2. **Deploy**
```bash
heroku login
heroku create bestcity-api
git push heroku main
```

3. **Configure Environment**
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
```

### Option 2: Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Deploy**
```bash
railway login
railway init
railway up
```

### Option 3: DigitalOcean App Platform

1. **Create app.yaml**
```yaml
name: bestcity-backend
services:
  - name: api
    github:
      repo: your-username/bestcity
      branch: main
      deploy_on_push: true
    build_command: npm install
    run_command: node server/server.js
    envs:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        value: ${MONGODB_URI}
```

2. Deploy via DigitalOcean dashboard or CLI

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_INFURA_ID: ${{ secrets.VITE_INFURA_ID }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Performance Optimization

### 1. Build Optimizations
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'web3-vendor': ['ethers', '@walletconnect/web3-provider']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### 2. Asset Optimization
- Compress images (WebP format)
- Minify CSS and JavaScript
- Enable Brotli compression
- Lazy load components

### 3. Caching Strategy
```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Don't cache HTML
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}
```

---

## Monitoring and Analytics

### 1. Sentry Error Tracking

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### 2. Google Analytics

```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 3. Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
```

---

## Security Checklist

### Pre-Deployment
- [ ] Update all dependencies
- [ ] Run `npm audit fix`
- [ ] Remove console.log statements
- [ ] Verify environment variables
- [ ] Test production build locally
- [ ] Check CORS configuration
- [ ] Enable HTTPS
- [ ] Configure CSP headers
- [ ] Set up rate limiting
- [ ] Enable security headers

### Security Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline';" always;
```

---

## Rollback Strategy

### Quick Rollback Steps

1. **Vercel**
```bash
# List deployments
vercel list

# Rollback to previous
vercel rollback
```

2. **Git-based**
```bash
# Revert last commit
git revert HEAD
git push origin main
```

3. **Docker**
```bash
# Tag previous working version
docker tag bestcity-frontend:latest bestcity-frontend:stable

# Rollback
docker run bestcity-frontend:stable
```

---

## Troubleshooting

### Common Issues

**Issue: Build fails with memory error**
```bash
# Solution: Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

**Issue: SPA routing not working**
- Configure server to serve index.html for all routes
- Check nginx configuration
- Verify vercel.json routes

**Issue: Environment variables not working**
- Ensure prefix with `VITE_`
- Rebuild after changing variables
- Check deployment platform configuration

---

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test dark/light mode toggle
- [ ] Check 3D property viewer
- [ ] Test wallet connection (if applicable)
- [ ] Verify API connectivity
- [ ] Check responsive design
- [ ] Test all navigation links
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify SSL certificate
- [ ] Test form submissions
- [ ] Check image loading
- [ ] Verify social sharing

---

**Last Updated:** 2025-11-06
**Version:** 1.0.0
