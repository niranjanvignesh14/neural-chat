/**
 * Provides fallback responses when AI is unavailable
 * @param {string} message - User input message
 * @returns {string} Contextual fallback response
 */
export function getFallbackReply(message) {
  const input = message.toLowerCase().trim();

  // Handle empty or whitespace-only messages
  if (!input || input.length === 0) {
    return 'Please say something so I can help.';
  }

  // Check specific keywords before general ones
  if (input.includes('summarize') || input.includes('summary')) {
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

  if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
    return 'Hello! I am Neural Chat Pro, a polished assistant built for modern web apps.';
  }

  if (input.includes('help')) {
    return 'I can help with greetings, summaries, writing support, and general questions. Ask me anything.';
  }

  return 'I am here to help with professional communication, brainstorming, and general questions.';
}

/**
 * Fetches AI response from Hugging Face or uses fallback
 * @param {string} message - User input message
 * @returns {Promise<string>} AI-generated or fallback response
 */
export async function getReply(message) {
  const huggingFaceKey = process.env.HUGGINGFACE_API_KEY;

  if (huggingFaceKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/Phi-3.5-mini-instruct', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: message }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Hugging Face error: ${response.status}`);
      }

      const data = await response.json();
      const generated = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
      if (generated) {
        const cleaned = generated.replace(message, '').trim();
        return cleaned || getFallbackReply(message);
      }
    } catch (error) {
      console.warn('Hugging Face request failed:', error.message);
    }
  }

  return getFallbackReply(message);
}
