# Neural Chat Pro

A professional chatbot app built with React, Node.js, Express, and Hugging Face.

## Features
- Modern chat interface
- React frontend with a polished dashboard-style layout
- Express backend for chat API requests
- Hugging Face integration with a local fallback
- Basic test coverage for the reply logic

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

Then open:
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
