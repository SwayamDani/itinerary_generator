

const openaiKey = ""; //OPENAI_KEY


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
      'content': `You are a travel guide. I will ask you questions about different cities. My first word will be the city name, second will the season i want to visit the city in and third will be the number of days i want to stay in the city. You have to create an itinerary for me.`
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

const form = document.querySelector('form');
const cityInput = document.querySelector('input[type="text"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); 
  const city = cityInput.value; 
  const data = await getCityInfoFromOpenAI(city);
  const lines = data.split('\n');

  const cityInfoElement = document.querySelector('.description');
  if (cityInfoElement) {
    cityInfoElement.innerHTML = '';
    lines.forEach(line => {
      cityInfoElement.innerHTML += `<p>${line}</p>`;
    });
    console.log('Data fetched successfully:');
  } else {
    console.log('Element with class "description" not found');
  }
});

