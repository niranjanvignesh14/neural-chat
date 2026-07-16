import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { getFallbackReply } from './utils.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const message = req.body?.message || '';

  if (!message.trim()) {
    return res.status(400).json({ error: 'A message is required.' });
  }

  try {
    const reply = await getReply(message);
    res.json({ reply });
  } catch (error) {
    console.error('Chat request failed:', error.message);
    res.status(500).json({ error: 'Unable to process your request.' });
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
