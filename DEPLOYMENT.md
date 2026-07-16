# Deployment Guide - Neural Chat Pro

Production deployment instructions for various platforms.

## Table of Contents
1. [Deployment Checklist](#deployment-checklist)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Platforms](#cloud-platforms)
4. [Environment Setup](#environment-setup)
5. [Monitoring & Maintenance](#monitoring--maintenance)

## Deployment Checklist

Before deploying to production, ensure:

- ✅ Tests pass: `npm test`
- ✅ Build succeeds: `npm run build`
- ✅ Environment variables configured
- ✅ MongoDB connection verified
- ✅ Hugging Face API key added (optional)
- ✅ Security vulnerabilities checked: `npm audit`
- ✅ Documentation updated
- ✅ Git commits pushed

## Docker Deployment

### Production Dockerfile

The `Dockerfile` is configured for production:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
EXPOSE 3001

CMD ["npm", "run", "start"]
```

### Build Docker Image

```bash
# Build image
docker build -t neural-chat:latest .

# Tag for registry
docker tag neural-chat:latest yourusername/neural-chat:latest

# Push to Docker Hub
docker login
docker push yourusername/neural-chat:latest
```

### Run Docker Container

```bash
docker run -d \
  --name neural-chat \
  -p 3001:3001 \
  -e MONGODB_URI=mongodb://mongo:27017/neural-chat \
  -e HUGGINGFACE_API_KEY=hf_xxx \
  -e NODE_ENV=production \
  neural-chat:latest
```

### Docker Compose Production

```yaml
version: '3.8'

services:
  app:
    image: neural-chat:latest
    restart: always
    ports:
      - '3001:3001'
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://mongo:27017/neural-chat
      HUGGINGFACE_API_KEY: ${HUGGINGFACE_API_KEY}
    depends_on:
      - mongo
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3001/api/health']
      interval: 30s
      timeout: 10s
      retries: 3

  mongo:
    image: mongo:7.0
    restart: always
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}

volumes:
  mongo-data:
```

## Cloud Platforms

### Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   brew install heroku/brew/heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create neural-chat-app
   ```

3. **Add MongoDB**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set HUGGINGFACE_API_KEY=hf_xxx
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **View Logs**
   ```bash
   heroku logs --tail
   ```

### Railway Deployment

1. **Connect GitHub Repository**
   - Go to https://railway.app
   - Connect your GitHub account
   - Select neural-chat repository

2. **Configure Environment**
   - Add `MONGODB_URI` variable
   - Add `HUGGINGFACE_API_KEY` variable
   - Set `NODE_ENV=production`

3. **Deploy**
   - Railway auto-deploys on git push

### Render Deployment

1. **Create Web Service**
   - Go to https://render.com
   - New Web Service
   - Connect GitHub repository

2. **Configure Build**
   ```
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Add Environment Variables**
   - `MONGODB_URI`
   - `HUGGINGFACE_API_KEY`
   - `NODE_ENV=production`

### AWS EC2 Deployment

1. **Launch EC2 Instance**
   ```bash
   # Ubuntu 22.04 LTS, t2.micro (free tier eligible)
   ```

2. **SSH into Instance**
   ```bash
   ssh -i key.pem ubuntu@your-instance-ip
   ```

3. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm git mongodb

   # Start MongoDB
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

4. **Clone and Deploy**
   ```bash
   git clone https://github.com/niranjanvignesh14/neural-chat.git
   cd neural-chat
   npm install
   npm run build
   ```

5. **Use PM2 for Process Management**
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "neural-chat" -- start
   pm2 startup
   pm2 save
   ```

6. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/default
   ```

   Add configuration:
   ```nginx
   server {
       listen 80 default_server;
       server_name _;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Enable HTTPS with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### DigitalOcean App Platform

1. **Create App**
   - Go to https://cloud.digitalocean.com/apps
   - Connect GitHub repository
   - Select neural-chat

2. **Configure Services**
   - **Frontend**: Build command `npm run build`
   - **Backend**: Start command `npm start`

3. **Add Database**
   - Add MongoDB database
   - Copy connection string to env variables

4. **Deploy**
   - Click Deploy
   - DigitalOcean auto-deploys on git push

## Environment Setup

### Production Environment Variables

```env
# Application
NODE_ENV=production
PORT=3001

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/neural-chat

# AI
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxx

# Security
CORS_ORIGIN=https://yourdomain.com
```

### Security Best Practices

1. **Never commit `.env` to git**
   ```bash
   echo ".env" >> .gitignore
   ```

2. **Use strong MongoDB passwords**
   ```bash
   # Generate secure password
   openssl rand -base64 32
   ```

3. **Enable MongoDB authentication**
   ```javascript
   // In docker-compose.yml or cloud setup
   MONGO_INITDB_ROOT_USERNAME=admin
   MONGO_INITDB_ROOT_PASSWORD=securepassword123
   ```

4. **Set up HTTPS**
   - Use Let's Encrypt (free)
   - Or purchase SSL certificate

5. **Configure CORS properly**
   ```javascript
   app.use(cors({
     origin: process.env.CORS_ORIGIN || 'http://localhost:3001'
   }));
   ```

## Monitoring & Maintenance

### Health Checks

Verify production deployment:
```bash
curl https://yourdomain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-07-16T10:30:00.000Z",
  "database": "connected"
}
```

### Logging

View application logs:
```bash
# Docker
docker logs -f neural-chat-app-1

# PM2
pm2 logs neural-chat

# Systemd
journalctl -u neural-chat -f
```

### Performance Monitoring

Track key metrics:
- API response times
- Database connection pool
- Memory usage
- CPU usage

Tools:
- PM2 Plus (https://pm2.io/plus)
- New Relic
- DataDog
- AWS CloudWatch

### Database Maintenance

Regular backups:
```bash
# MongoDB local backup
mongodump --out backup/$(date +%Y%m%d)

# MongoDB Atlas automatic backups
# Enabled by default
```

### Updates

Update Node.js:
```bash
node --version  # Check current
nvm install 20.x
nvm use 20.x
```

Update dependencies:
```bash
npm update
npm audit fix
npm test
```

### Scaling

As traffic increases:

1. **Horizontal Scaling** (multiple servers)
   - Use load balancer (nginx, HAProxy)
   - Deploy multiple app instances
   - Use MongoDB replication

2. **Vertical Scaling** (bigger server)
   - Increase server resources
   - Optimize database queries

3. **Caching**
   - Add Redis for session caching
   - Implement message caching

## Rollback Plan

If deployment fails:

```bash
# View deployment history
git log --oneline -10

# Revert to previous version
git revert <commit-id>
git push

# Or reset to previous tag
git reset --hard v1.0.0
git push --force
```

## Success Metrics

Monitor these KPIs:

| Metric | Target |
|--------|--------|
| API Response Time | < 500ms |
| Uptime | > 99.9% |
| Database Latency | < 50ms |
| Bundle Size | < 50KB (gzipped) |
| Error Rate | < 0.1% |

## Support

- Deployment issues: GitHub Issues
- Performance questions: Discussions
- Emergency: support@neural-chat.dev

Happy deploying! 🚀
