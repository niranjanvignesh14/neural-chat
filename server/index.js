import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { getFallbackReply } from './utils.js';
import { connectToDatabase, ChatMessage, isDatabaseConnected } from './db.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const dbConnection = await connectToDatabase();
if (dbConnection) {
  console.log('Connected to MongoDB');
} else {
  console.warn('MongoDB is unavailable. Chat persistence is disabled until the database is available.');
}

app.post('/api/chat', async (req, res) => {
  const message = req.body?.message || '';

  if (!message.trim()) {
    return res.status(400).json({ error: 'A message is required.' });
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
    res.status(500).json({ error: 'Unable to process your request.' });
  }
});

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Neural Chat API running on http://localhost:${PORT}`);
});
