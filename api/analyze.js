// api/analyze.js
// Vercel serverless function that handles POST /api/analyze

function buildChatPayload(base64Image) {
  return {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this image. Provide exactly 10 abstract, poetic sets of keywords (no more than 3 words per set) describing the person, lighting, or mood.\n- Return exactly 10 single-word keywords (no extra punctuation).\n- Separate words with a single ' • ' (bullet) character.\n- Example output: 'Shadow • Glimmer • Blue'.\nReturn ONLY the keywords string with no explanation."
          },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${base64Image}` }
          }
        ]
      }
    ],
    max_tokens: 60
  };
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse body if it's a string
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { imageBase64 } = body;
    
    if (!imageBase64) {
      console.error('Missing imageBase64 in request');
      return res.status(400).json({ error: 'Missing imageBase64' });
    }

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
      console.error('OPENAI_API_KEY environment variable not set');
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
    }

    console.log('Building payload for image analysis...');
    const payload = buildChatPayload(imageBase64);

    console.log('Calling OpenAI API...');
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
      console.error('OpenAI API error:', data);
      return res.status(r.status).json(data);
    }

    console.log('Success, returning data');
    res.status(200).json(data);
  } catch (err) {
    console.error('Analyze error:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};
