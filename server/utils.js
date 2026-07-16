export function getFallbackReply(message) {
  const input = message.toLowerCase().trim();

  if (!input) {
    return 'Please say something so I can help.';
  }

  if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
    return 'Hello! I am Neural Chat Pro, a polished assistant built for modern web apps.';
  }

  if (input.includes('help')) {
    return 'I can help with greetings, summaries, writing support, and general questions. Ask me anything.';
  }

  if (input.includes('summarize')) {
    return 'I can summarize content, notes, or long messages into concise points. Share the text and I will help.';
  }

  if (input.includes('email')) {
    return 'I can help draft professional emails. Tell me the purpose and audience and I will write one.';
  }

  if (input.includes('time')) {
    return `The current time is ${new Date().toLocaleTimeString()}.`;
  }

  if (input.includes('date')) {
    return `Today is ${new Date().toDateString()}.`;
  }

  return 'I am here to help with professional communication, brainstorming, and general questions.';
}

export async function getReply(message) {
  const huggingFaceKey = process.env.HUGGINGFACE_API_KEY;

  if (huggingFaceKey) {
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/Phi-3.5-mini-instruct', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: message })
      });

      if (!response.ok) {
        throw new Error(`Hugging Face error: ${response.status}`);
      }

      const data = await response.json();
      const generated = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
      if (generated) {
        return generated.replace(message, '').trim() || getFallbackReply(message);
      }
    } catch (error) {
      console.error('Hugging Face request failed:', error.message);
    }
  }

  return getFallbackReply(message);
}
