import axios from 'axios';

const Chatbot = async (req, res) => {
  try {
    const { message } = req.body;

    console.log('📩 USER MESSAGE:', message);

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `
You are a structured AI assistant.

Rules:
- Always use bullet points for lists
- Use headings when needed
- Keep answers clear and scannable
- Avoid long paragraphs
- Be concise but informative
            `,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botReply =
      response.data?.choices?.[0]?.message?.content || 'No response from Groq';

    console.log('🤖 FORMATTED RESPONSE:', botReply);

    return res.status(200).json({
      reply: botReply,
    });
  } catch (error) {
    console.log('❌ GROQ ERROR:', error?.response?.data || error.message);

    return res.status(500).json({
      error: 'Groq request failed',
    });
  }
};

export { Chatbot };
