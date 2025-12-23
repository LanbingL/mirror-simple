// server.js
// Simple Express backend that uses server/prompt.js to build the OpenAI payload
// and forwards the request to OpenAI while keeping the API key on the server.

const express = require('express');
const cors = require('cors');
const { buildChatPayload } = require('./prompt');

const app = express();
app.use(cors());
app.use(express.json({ limit: '6mb' })); // images in base64 can be large

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) console.warn('Warning: OPENAI_API_KEY not set in environment');

app.post('/api/analyze', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'Missing imageBase64' });

    const payload = buildChatPayload(imageBase64);

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);

    // Forward the OpenAI response as-is. Client expects data.choices[0].message.content
    res.json(data);
  } catch (err) {
    console.error('Analyze error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => res.send('ok'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
