import config from './config.js';

const openaiKey = config.OPENAI_API_KEY;
const getCityInfoFromOpenAI = async (city) => {
  const baseUrl = "https://api.openai.com/v1/chat/completions";
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${openaiKey}`
  };
  const data = {
    'model': 'gpt-3.5-turbo',
    'messages': [{
      'role': 'system',
      'content': `You are a travel guide. I will ask you questions about different cities.  You have to create an itinerary for me. And if the number of the days or/and the season is not given you give the best itinerary you can think of. And also provide the approx spend on the given itenerary in usd.`
    }, {
      'role': 'user',
      'content': `Let's start with ${city}.`
    }],
  };

  try {
    const res = await axios.post(baseUrl, data, { headers: headers });
    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching data from OpenAI:", error.response ? error.response.data : error.message);
    throw error;
  }
};

const form = document.getElementById('search-form');
const cityInput = document.querySelector('input[type="text"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); 
  const city = cityInput.value; 
  const loading = document.querySelector('.loading');
  loading.style.display = 'block';
  const data = await getCityInfoFromOpenAI(city);
  const lines = data.split('\n');

  const cityInfoElement = document.querySelector('.description');
  const itineraryElement = document.querySelector('.card-content');
  if (cityInfoElement) {
    cityInfoElement.innerHTML = '';
    const parsedHTML = marked.parse(lines.join('\n'));
    cityInfoElement.innerHTML = parsedHTML;
    itineraryElement.style.display = 'block';
    loading.style.display = 'none';
    console.log('Data fetched successfully:');
  } else {
    console.log('Element with class "description" not found');
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault(); 
  const city = cityInput.value; 
  const loading = document.querySelector('.loading');
  loading.style.display = 'block';
  const data = await getCityInfoFromOpenAI(city);
  const lines = data.split('\n');

  const cityInfoElement = document.querySelector('.description');
  const itineraryElement = document.querySelector('.card-content');
  if (cityInfoElement) {
    cityInfoElement.innerHTML = '';
    const parsedHTML = marked.parse(lines.join('\n'));
    cityInfoElement.innerHTML = parsedHTML;
    itineraryElement.style.display = 'block';
    loading.style.display = 'none';
    console.log('Data fetched successfully:');
  } else {
    console.log('Element with class "description" not found');
  }
});

