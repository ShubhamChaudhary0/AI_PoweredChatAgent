import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const getBotReply = async (message) => {
  const text = message.trim().toLowerCase();

  if (text.includes('hello') || text.includes('hi')) {
    return 'Hello! I am your AI assistant. Ask me about features, pricing, or say hello to get started.';
  }

  if (text.includes('pricing')) {
    return 'Our starter plan is $19/month and includes unlimited chat history and two integrations.';
  }

  if (text.includes('feature') || text.includes('features')) {
    return 'This chatbot can answer product questions, guide onboarding, and help with common support requests.';
  }

  if (text.includes('help')) {
    return 'You can ask me about pricing, features, or how to get started with the product.';
  }

  if (text.includes('openai') || text.includes('api')) {
    return 'You can connect this agent to OpenAI by setting OPENAI_API_KEY in the server environment.';
  }

  return 'I can help with product questions, onboarding, and basic support. Try asking about pricing or features.';
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'A text message is required.' });
  }

  try {
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: message }],
          },
        ],
        systemInstruction: 'You are a helpful AI assistant. Answer any question the user asks accurately and concisely. You can help with coding, math, science, general knowledge, and any other topic.',
        generationConfig: {
          temperature: 0.7,
        },
      });

      const reply = result.response.text();
      if (reply) {
        return res.json({ reply });
      }
    }

    const fallbackReply = await getBotReply(message);
    return res.json({ reply: fallbackReply });
  } catch (error) {
    console.error('Gemini API error:', error.message);
    const fallbackReply = await getBotReply(message);
    return res.json({ reply: fallbackReply, note: 'Using local fallback response.' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Chatbot server listening on port ${port}`);
});
