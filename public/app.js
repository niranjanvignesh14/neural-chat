const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messages = document.getElementById('messages');

function addMessage(text, role) {
  const bubble = document.createElement('div');
  bubble.className = `message ${role}`;
  bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    return;
  }

  addMessage(text, 'user');
  input.value = '';
  input.disabled = true;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();
    addMessage(data.reply?.text || 'Sorry, I could not respond.', 'bot');
  } catch (error) {
    addMessage('The bot is unavailable right now.', 'bot');
  } finally {
    input.disabled = false;
    input.focus();
  }
});

addMessage('Hello! I am Neural Chat. Ask me something simple.', 'bot');
