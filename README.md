# Neural Chat Pro

A polished, premium AI assistant experience built with React, Node.js, Express, and Hugging Face.

## Why it stands out
- Classy, modern interface with a refined dashboard aesthetic
- Fast React frontend with a polished conversational layout
- Robust Express backend for chat requests
- Hugging Face AI integration with a graceful fallback
- Clean structure suitable for portfolio, startup, or demo use

## Tech Stack
- React
- Vite
- Node.js
- Express
- Hugging Face Inference API

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
```

Open:
- http://localhost:5173 for the frontend
- http://localhost:3001/api/health for the backend health check

## Environment Variables
Create a `.env` file with:
```env
HUGGINGFACE_API_KEY=your_token_here
```

## Testing
```bash
npm test
```

## Deployment
- Docker support is included via Dockerfile and docker-compose.yml
- GitHub Actions workflow is included for CI/CD
