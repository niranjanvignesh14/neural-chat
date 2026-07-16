# API Documentation - Neural Chat Pro

Complete API reference for Neural Chat Pro backend.

## Base URL

- **Development**: `http://localhost:3001`
- **Production**: `https://neural-chat.yourdomain.com` (depends on deployment)

## Authentication

Currently, Neural Chat Pro uses no authentication. All endpoints are publicly accessible.

For future enhancements, consider:
- API key authentication
- JWT tokens
- OAuth2 integration

## Endpoints

### 1. POST /api/chat

Send a message to the AI and receive a response.

**Request**
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is artificial intelligence?"
  }'
```

**Request Body**
```json
{
  "message": "Your question or message here"
}
```

**Parameters**
| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| message | string | Yes | 1-5000 characters |

**Response (Success)**
```json
{
  "reply": "AI is the simulation of human intelligence processes by computers..."
}
```

**Response (Error)**
```json
{
  "error": "A message is required."
}
```

**Status Codes**
| Code | Meaning |
|------|---------|
| 200 | Message processed successfully |
| 400 | Invalid request (missing message, too long, etc.) |
| 500 | Server error during processing |

**Examples**

Basic message:
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

Response:
```json
{
  "reply": "Hello! I am Neural Chat Pro, a polished assistant built for modern web apps."
}
```

Multi-line message:
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Summarize this:\nArtificial intelligence is..."}'
```

Response:
```json
{
  "reply": "I can summarize content, notes, or long messages into concise points..."
}
```

### 2. GET /api/history

Retrieve all chat messages in chronological order.

**Request**
```bash
curl -X GET http://localhost:3001/api/history
```

**Response (Success)**
```json
{
  "messages": [
    {
      "_id": "64f5e8c9e3d4b2c1a9f8e7d6",
      "role": "user",
      "content": "Hello",
      "createdAt": "2026-07-16T10:30:00.000Z"
    },
    {
      "_id": "64f5e8cbe3d4b2c1a9f8e7d7",
      "role": "assistant",
      "content": "Hello! How can I help?",
      "createdAt": "2026-07-16T10:30:05.123Z"
    }
  ]
}
```

**Response (Empty)**
```json
{
  "messages": []
}
```

**Status Codes**
| Code | Meaning |
|------|---------|
| 200 | History retrieved successfully |
| 500 | Database error |

**Notes**
- Returns all messages from the conversation
- Messages are sorted by creation date (oldest first)
- Empty array returned if no messages exist
- Database connection not required; returns empty if offline

### 3. GET /api/health

Check server and database health status.

**Request**
```bash
curl -X GET http://localhost:3001/api/health
```

**Response (Healthy)**
```json
{
  "status": "ok",
  "timestamp": "2026-07-16T10:30:00.000Z",
  "database": "connected"
}
```

**Response (Database Down)**
```json
{
  "status": "ok",
  "timestamp": "2026-07-16T10:30:00.000Z",
  "database": "disconnected"
}
```

**Status Codes**
| Code | Meaning |
|------|---------|
| 200 | Server is healthy |
| 503 | Server is unhealthy |

**Uses**
- Load balancer health checks
- Monitoring and alerting
- Deployment validation

## Message Schema

### ChatMessage Object

```typescript
interface ChatMessage {
  _id: string;                 // MongoDB ObjectId
  role: 'user' | 'assistant'; // Message sender
  content: string;             // Message text
  createdAt: ISO8601Date;     // Creation timestamp
}
```

**Example**
```json
{
  "_id": "64f5e8c9e3d4b2c1a9f8e7d6",
  "role": "user",
  "content": "What is Node.js?",
  "createdAt": "2026-07-16T10:30:00.000Z"
}
```

## Error Handling

### Error Response Format

All errors follow this format:
```json
{
  "error": "Error description"
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "A message is required." | Empty message sent | Send non-empty message |
| "Message is too long..." | Message > 5000 chars | Reduce message length |
| "Unable to process request" | Server error | Try again, check logs |
| "Unable to load history" | Database error | Check MongoDB connection |

## Request/Response Examples

### JavaScript/Fetch

```javascript
// Send message
async function sendMessage(message) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  
  return response.json();
}

// Get history
async function getHistory() {
  const response = await fetch('/api/history');
  return response.json();
}

// Check health
async function checkHealth() {
  const response = await fetch('/api/health');
  return response.json();
}
```

### Python/Requests

```python
import requests

BASE_URL = "http://localhost:3001"

# Send message
def send_message(message):
    response = requests.post(
        f"{BASE_URL}/api/chat",
        json={"message": message}
    )
    return response.json()

# Get history
def get_history():
    response = requests.get(f"{BASE_URL}/api/history")
    return response.json()

# Check health
def check_health():
    response = requests.get(f"{BASE_URL}/api/health")
    return response.json()
```

### cURL

```bash
# Send message
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

# Get history
curl http://localhost:3001/api/history

# Check health
curl http://localhost:3001/api/health
```

## Rate Limiting

Currently not implemented. Consider adding for production:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.post('/api/chat', limiter, async (req, res) => {
  // ...
});
```

## CORS Configuration

Default CORS allows all origins:

```javascript
app.use(cors());
```

For production, restrict to specific origins:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));
```

## Pagination (Future)

For implementing message pagination:

```
GET /api/history?page=1&limit=50

Response:
{
  "messages": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

## Versioning

Current version: **v1.0**

Future versions can be accessed:
```
GET /api/v1/chat
GET /api/v2/chat
```

## WebSocket Support (Future)

For real-time updates:

```javascript
// Client
const socket = io('http://localhost:3001');
socket.emit('message', { text: 'Hello' });
socket.on('response', (data) => {
  console.log(data.reply);
});
```

## Monitoring & Metrics

Track API usage:

```bash
# Response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/api/health

# See: https://curl.haxx.se/docs/manpage.html#-w
```

## SDK (Future)

JavaScript SDK:

```javascript
import NeuralChat from '@neural-chat/sdk';

const client = new NeuralChat({
  baseURL: 'http://localhost:3001'
});

const response = await client.chat.send('Hello');
const history = await client.messages.list();
```

## Support

- API Issues: https://github.com/niranjanvignesh14/neural-chat/issues
- Questions: https://github.com/niranjanvignesh14/neural-chat/discussions
- Email: api-support@neural-chat.dev

---

Last Updated: 2026-07-16
Version: 1.0
