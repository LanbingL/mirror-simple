// api/analyze.js
// Vercel Serverless function to analyze an image with OpenAI Chat Completions

// Build payload (kept local to avoid cross-file issues)
function buildChatPayload(base64Image) {
  return {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: "Analyze this image. Provide exactly 10 abstract, poetic single keywords describing the person, lighting, or mood. Separate words with ' • '. Example: 'Shadow • Glimmer • Blue'. Return ONLY the keywords string with no explanation."
          },
          {
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${base64Image}` }
          }
        ]
      }
    ],
    max_tokens: 60
  };
}

module.exports = async (req, res) => {
  // Basic CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    let body = req.body;
    if (!body) return res.status(400).json({ error: 'Empty body' });
    if (typeof body === 'string') body = JSON.parse(body);

    const { imageBase64 } = body;
    if (!imageBase64) return res.status(400).json({ error: 'Missing imageBase64' });

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });

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
    if (!r.ok) {
      return res.status(r.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('analyze error', err);
    return res.status(500).json({ error: err.message });
  }
};
