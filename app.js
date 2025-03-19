const getCityInfoFromOpenAI = async (city) => {
  try {
    const res = await axios.post('/api/getItinerary', { city });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching data:", error.response ? error.response.data : error.message);
    throw error;
  }
};

const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const spinner = document.getElementById('spinner');
const errorMessage = document.getElementById('error-message');
const resultsContainer = document.getElementById('results-container');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value;
  
  if (!city) return;
  
  // Show loading state
  spinner.style.display = 'block';
  errorMessage.style.display = 'none';
  resultsContainer.querySelector('.card-content').style.display = 'none';
  
  try {
    const data = await getCityInfoFromOpenAI(city);
    
    const cityInfoElement = document.querySelector('.description');
    const itineraryElement = document.querySelector('.card-content');
    
    if (cityInfoElement) {
      cityInfoElement.innerHTML = '';
      const parsedHTML = marked.parse(data);
      cityInfoElement.innerHTML = parsedHTML;
      itineraryElement.style.display = 'block';
      console.log('Data fetched successfully');
    } else {
      console.log('Element with class "description" not found');
    }
  } catch (error) {
    console.error('Error:', error);
    errorMessage.style.display = 'block';
  } finally {
    spinner.style.display = 'none';
  }
});