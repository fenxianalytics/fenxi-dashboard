export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { system, messages, quality } = req.body;
    const model = quality === 'high' ? 'gpt-5.4-mini' : 'gpt-4o-mini';
    const max_tokens = quality === 'high' ? 1200 : 900;

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model,
        max_tokens,
        messages: [{ role: 'system', content: system }, ...messages]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenAI error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    res.status(200).json({ content, model });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}