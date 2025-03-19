import axios from 'axios';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { city } = req.body;
  
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiKey) {
    return res.status(500).json({ error: 'API key is not configured' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        'model': 'gpt-3.5-turbo',
        'messages': [{
          'role': 'system',
          'content': `You are a travel guide. I will ask you questions about different cities. You have to create an itinerary for me. And if the number of the days or/and the season is not given you give the best itinerary you can think of. And also provide the approx spend on the given itenerary in usd.`
        }, {
          'role': 'user',
          'content': `Let's start with ${city}.`
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        }
      }
    );

    return res.status(200).json({ data: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Error fetching data from OpenAI:", error.response ? error.response.data : error.message);
    return res.status(500).json({ 
      error: 'Failed to fetch itinerary', 
      details: error.response ? error.response.data : error.message 
    });
  }
}