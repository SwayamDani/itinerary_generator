// Express server setup
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// API Endpoint for Itineraries
app.post('/api/getItinerary', async (req, res) => {
  const { city } = req.body;
  
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiKey) {
    return res.status(500).json({ error: 'API key is not configured' });
  }

  try {
    // Extract potential parameters from the user input
    const cityInput = city.trim();
    let days = "3"; // Default to 3 days if not specified
    let season = ""; // Default empty if not specified
    
    // Check if input contains number of days
    const daysMatch = cityInput.match(/\b(\d+)\s*(day|days)\b/i);
    if (daysMatch) {
      days = daysMatch[1];
    }
    
    // Check if input contains season
    const seasons = ["spring", "summer", "fall", "autumn", "winter"];
    for (const s of seasons) {
      if (cityInput.toLowerCase().includes(s)) {
        season = s;
        break;
      }
    }
    
    // Clean the city name from the additional parameters
    let cleanCity = cityInput
      .replace(/\b\d+\s*(day|days)\b/gi, '')
      .replace(new RegExp(seasons.join('|'), 'gi'), '')
      .trim();
    
    console.log(`Fetching itinerary for: ${cleanCity}, Season: ${season || 'Not specified'}, Days: ${days}`);

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        'model': 'gpt-3.5-turbo',
        'messages': [
          {
            'role': 'system',
            'content': `You are a travel guide expert. Create a detailed and engaging itinerary for the specified city.
            If days are specified, tailor the itinerary for exactly that many days.
            If a season is specified, adapt the recommendations to that season.
            Structure your response with clear day-by-day recommendations, including:
            1. Morning, afternoon, and evening activities
            2. Recommended restaurants for meals
            3. Estimated costs in USD for each activity and meal
            4. Cultural tips and local insights
            5. At the end, provide a summary with total estimated cost for the entire trip including accommodation (mid-range hotel)
            Format your response in markdown for better readability.`
          },
          {
            'role': 'user',
            'content': `Create an itinerary for ${cleanCity}${season ? ' during ' + season : ''}${days ? ' for ' + days + ' days' : ''}.`
          }
        ]
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
});

// Ensure all routes not handled above return the main index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For Vercel serverless functions