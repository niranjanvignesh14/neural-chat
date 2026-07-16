# Setup Guide - Neural Chat Pro

Complete step-by-step guide to get Neural Chat Pro running on your machine.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Docker Setup](#docker-setup)
4. [Environment Configuration](#environment-configuration)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **OS**: macOS, Linux, or Windows (WSL2)
- **Node.js**: 20.x or higher ([Download](https://nodejs.org/))
- **npm**: 10.x or higher (comes with Node.js)
- **Git**: 2.x or higher ([Download](https://git-scm.com/))

### Optional
- **MongoDB**: 7.0 or higher (for local database)
- **Docker**: 24.x or higher (for containerized deployment)
- **Postman**: API testing tool

### Verify Installations
```bash
node --version      # Should be v20.x or higher
npm --version       # Should be 10.x or higher
git --version       # Should be 2.x or higher
```

## Local Development

### 1. Clone Repository
```bash
git clone https://github.com/niranjanvignesh14/neural-chat.git
cd neural-chat
```

### 2. Install Dependencies
```bash
npm install
```

Expected output:
```
up to date, audited 156 packages in 4.2s
```

### 3. Configure Environment Variables

Copy the example configuration:
```bash
cp .env.example .env
```

Edit `.env` and add your settings:
```env
# Hugging Face API Key (optional but recommended)
# Get one from https://huggingface.co/settings/tokens
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxx

# MongoDB Connection String
# Local: mongodb://127.0.0.1:27017/neural-chat
# Cloud: mongodb+srv://user:password@cluster.mongodb.net/neural-chat
MONGODB_URI=mongodb://127.0.0.1:27017/neural-chat

# Server Port
PORT=3001

# Environment
NODE_ENV=development
```

### 4. Start MongoDB (if local)

**macOS (Homebrew)**
```bash
brew services start mongodb-community
```

**Ubuntu/Debian**
```bash
sudo systemctl start mongod
```

**Verify MongoDB is running**
```bash
mongosh --eval "db.adminCommand('ping')"
# Should return: { ok: 1 }
```

### 5. Start Development Server

```bash
npm run dev
```

This runs both frontend and backend:
- **Frontend**: http://localhost:5173 (Vite React)
- **Backend**: http://localhost:3001 (Express API)
- **API Health**: http://localhost:3001/api/health

Expected output:
```
> neural-chat-pro@1.0.0 dev
> concurrently "npm run server" "npm run client"

✓ Connected to MongoDB
Neural Chat API running on http://localhost:3001
VITE v5.4.21 ready in 234 ms
```

### 6. Open Browser

Visit: http://localhost:5173

### 7. Test the Application

- Type a message: "Hello"
- Click suggestions
- Copy messages with the 📋 button
- View timestamps on each message
- Clear chat with the ✕ button

## Docker Setup

### 1. Install Docker

Download from: https://www.docker.com/products/docker-desktop

Verify installation:
```bash
docker --version    # Should be 24.x or higher
docker compose version  # Should be 2.x or higher
```

### 2. Build and Run

```bash
docker compose up --build
```

**First run** (1-2 minutes):
```
[+] Running 3/3
 ✔ Container neural-chat-mongo-1    Started
 ✔ Container neural-chat-app-1      Started
```

**Subsequent runs** (30 seconds):
```
[+] Running 2/2
 ✔ Container neural-chat-mongo-1    Running
 ✔ Container neural-chat-app-1      Started
```

### 3. Access Application

- **App**: http://localhost:3001
- **API**: http://localhost:3001/api/health

### 4. Stop Application

```bash
docker compose down
```

To remove all data:
```bash
docker compose down -v
```

### 5. Troubleshoot Docker

Check container status:
```bash
docker compose ps
```

View logs:
```bash
docker compose logs -f app
docker compose logs -f mongo
```

Rebuild without cache:
```bash
docker compose up --build --no-cache
```

## Environment Configuration

### Hugging Face Setup

1. Create account: https://huggingface.co
2. Generate token: https://huggingface.co/settings/tokens
3. Add to `.env`:
   ```env
   HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxx
   ```

Without API key, the app uses intelligent fallback responses.

### MongoDB Setup

**Option 1: Local MongoDB**
```env
MONGODB_URI=mongodb://127.0.0.1:27017/neural-chat
```

**Option 2: MongoDB Atlas (Cloud)**
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create cluster and get connection string
3. Add to `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/neural-chat
   ```

**Option 3: Docker MongoDB**
```bash
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password mongo:7.0
```

Then use:
```env
MONGODB_URI=mongodb://admin:password@localhost:27017/neural-chat
```

## Running Tests

### Run All Tests
```bash
npm test
```

Expected output:
```
✔ returns a friendly greeting for hello messages
✔ offers help for support questions

ℹ tests 2
ℹ pass 2
ℹ fail 0
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Add More Tests
Edit `server/utils.test.js` to add new test cases:
```javascript
test('handles specific input', () => {
  assert.match(getFallbackReply('your test input'), /expected output/i);
});
```

## Production Build

### Build for Production
```bash
npm run build
```

Creates optimized bundle in `dist/` directory.

### Run Production Server
```bash
npm start
```

Serves frontend from `dist/` and enables static file serving.

## Troubleshooting

### Port Already in Use

**Error**: `Address already in use :3001`

**Solution**:
```bash
# Find process using port 3001
sudo lsof -iTCP:3001 -sTCP:LISTEN -P -n

# Kill the process
sudo kill -9 <PID>

# Or use different port
PORT=3002 npm run dev
```

### MongoDB Connection Failed

**Error**: `ECONNREFUSED 127.0.0.1:27017`

**Solutions**:
1. Start MongoDB:
   ```bash
   brew services start mongodb-community  # macOS
   sudo systemctl start mongod            # Linux
   ```

2. Or use Docker:
   ```bash
   docker compose up -d mongo
   ```

3. Or use MongoDB Atlas (cloud)

### Node Modules Issues

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clean and rebuild
npm run build -- --force
```

### CORS Errors

Check that frontend and backend are on correct ports:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

If using different ports, update CORS in `server/index.js`.

## Next Steps

- ✅ Start development server
- 📚 Read API Documentation in README.md
- 🐳 Try Docker deployment
- 🤖 Set up Hugging Face API
- 🧪 Write additional tests
- 🚀 Deploy to cloud

## Support

- Issues: https://github.com/niranjanvignesh14/neural-chat/issues
- Discussions: https://github.com/niranjanvignesh14/neural-chat/discussions
- Email: support@neural-chat.dev

Happy coding! 🚀
