# Neural Chat Pro

![Build Status](https://github.com/niranjanvignesh14/neural-chat/actions/workflows/ci-cd.yml/badge.svg)
![License](https://img.shields.io/github/license/niranjanvignesh14/neural-chat?color=informational)

Neural Chat Pro is a polished chatbot platform built for professional demos and modern deployments. It pairs a React frontend with a Node.js/Express API, MongoDB persistence, Docker support, and Hugging Face AI assistance.

## Highlights
- Elegant premium interface with a refined chat experience
- React + Vite frontend with responsive layout
- Express backend with MongoDB chat persistence
- Hugging Face integration for AI-generated responses
- Docker-ready deployment and GitHub Actions CI/CD

## Features
- Live conversational chat experience
- Saved chat history in MongoDB
- Resilient fallback responses when AI is unavailable
- Docker container support
- CI/CD workflow for automated testing and build

## Tech Stack
- React
- Vite
- Node.js
- Express
- MongoDB (Mongoose)
- Hugging Face Inference API
- Docker
- GitHub Actions

## Quick Start
1. Install dependencies
```bash
npm install
```
2. Set up environment variables
```bash
cp .env.example .env
```
3. Run the app in development
```bash
npm run dev
```

Open:
- Frontend: http://localhost:5173
- Backend health check: http://localhost:3001/api/health

## Environment Variables
Create a `.env` file with the following values:
```env
HUGGINGFACE_API_KEY=your_token_here
MONGODB_URI=mongodb://127.0.0.1:27017/neural-chat
PORT=3001
```

## Docker
Build and run the application with Docker Compose:
```bash
docker compose up --build
```

## Tests
Run the validation suite:
```bash
npm test
```

## Repository Structure
- `src/` — React frontend code
- `server/` — Express server and MongoDB models
- `public/` — static assets
- `.github/workflows/ci-cd.yml` — CI/CD workflow
- `Dockerfile` — container image definition
- `docker-compose.yml` — local docker-compose setup

## Contributing
Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and use the issue templates for bugs and feature requests.

## Security
Report security issues via the repository security policy.

## License
This project is licensed under the MIT License.
