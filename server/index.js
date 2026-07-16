import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { getReply } from './utils.js';
import { connectToDatabase, ChatMessage, isDatabaseConnected } from './db.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize database
const dbConnection = await connectToDatabase();
if (dbConnection) {
  console.log('✓ Connected to MongoDB');
} else {
  console.warn('⚠ MongoDB is unavailable. Chat persistence is disabled until the database is available.');
}

/**
 * POST /api/chat - Process user message and return AI response
 */
app.post('/api/chat', async (req, res) => {
  const message = req.body?.message || '';

  if (!message.trim()) {
    return res.status(400).json({ error: 'A message is required.' });
  }

  if (message.length > 5000) {
    return res.status(400).json({ error: 'Message is too long. Maximum 5000 characters.' });
  }

  try {
    if (isDatabaseConnected()) {
      const chatMessage = new ChatMessage({ role: 'user', content: message });
      await chatMessage.save();
    }

    const replyText = await getReply(message);

    if (isDatabaseConnected()) {
      const replyMessage = new ChatMessage({ role: 'assistant', content: replyText });
      await replyMessage.save();
    }

    res.json({ reply: replyText });
  } catch (error) {
    console.error('Chat request failed:', error.message);
    res.status(500).json({ error: 'Unable to process your request. Please try again.' });
  }
});

/**
 * GET /api/history - Retrieve chat message history
 */
app.get('/api/history', async (_req, res) => {
  if (!isDatabaseConnected()) {
    return res.json({ messages: [] });
  }

  try {
    const messages = await ChatMessage.find().sort({ createdAt: 1 }).lean();
    res.json({ messages });
  } catch (error) {
    console.error('History request failed:', error.message);
    res.status(500).json({ error: 'Unable to load chat history.' });
  }
});

/**
 * GET /api/health - Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: isDatabaseConnected() ? 'connected' : 'disconnected'
  });
});

/**
 * Serve React build in production
 */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Neural Chat API running on http://localhost:${PORT}`);
  console.log(`📝 Chat endpoint: POST /api/chat`);
  console.log(`📚 History endpoint: GET /api/history`);
  console.log(`💚 Health check: GET /api/health\n`);
});
