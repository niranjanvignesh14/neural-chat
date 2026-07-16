const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
};

function getFallbackReply(message) {
  const input = message.toLowerCase().trim();

  if (!input) {
    return 'Say something and I will respond.';
  }

  if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
    return 'Hello! I am your local chat assistant. Ask me anything simple and I will help.';
  }

  if (input.includes('time')) {
    return `The current time is ${new Date().toLocaleTimeString()}.`;
  }

  if (input.includes('date')) {
    return `Today is ${new Date().toDateString()}.`;
  }

  if (input.includes('help')) {
    return 'I can greet you, answer simple questions, tell the time or date, and help you get started with building a chatbot.';
  }

  if (input.includes('weather')) {
    return 'I do not have live weather data right now, but I can help you build a weather bot next.';
  }

  if (input.includes('name')) {
    return 'I am Neural Chat, a simple assistant built with Node.js.';
  }

  return 'I am here to help. Try asking about the time, date, or how to build a chatbot.';
}

async function getReply(message) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a friendly assistant.' },
            { role: 'user', content: message }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data.choices?.[0]?.message?.content?.trim() || getFallbackReply(message),
        source: 'openai'
      };
    } catch (error) {
      console.error('OpenAI request failed:', error.message);
    }
  }

  return {
    text: getFallbackReply(message),
    source: 'local'
  };
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function serveStatic(res, filePath) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const extension = path.extname(filePath);
    const contentType = MIME_TYPES[extension] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'POST' && requestUrl.pathname === '/api/chat') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const reply = await getReply(payload.message || '');
        sendJson(res, 200, { reply });
      } catch (error) {
        sendJson(res, 400, { error: 'Invalid request body' });
      }
    });
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname === '/') {
    serveStatic(res, path.join(PUBLIC_DIR, 'index.html'));
    return;
  }

  const safePath = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
  const filePath = path.join(PUBLIC_DIR, safePath);

  if (filePath.startsWith(PUBLIC_DIR)) {
    serveStatic(res, filePath);
  } else {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
  }
});

server.listen(PORT, () => {
  console.log(`Neural Chat running at http://localhost:${PORT}`);
});
