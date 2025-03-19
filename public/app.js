// API Call Function
const getCityInfoFromOpenAI = async (city) => {
  try {
    const res = await axios.post('/api/getItinerary', { city });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching data:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// DOM Elements
const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const spinner = document.getElementById('spinner');
const errorMessage = document.getElementById('error-message');
const resultsContainer = document.getElementById('results-container');
const cardContent = document.querySelector('.card-content');

// Form Submit Event
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  
  if (!city) {
    // Show an error for empty input
    cityInput.classList.add('border-red-500', 'ring-1', 'ring-red-500');
    setTimeout(() => {
      cityInput.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
    }, 3000);
    return;
  }
  
  // Show loading state
  spinner.classList.remove('hidden');
  spinner.classList.add('flex');
  errorMessage.classList.add('hidden');
  cardContent.classList.add('hidden');
  
  // Smooth scroll to spinner
  spinner.scrollIntoView({ behavior: 'smooth' });
  
  try {
    const data = await getCityInfoFromOpenAI(city);
    
    const descriptionElement = document.querySelector('.description');
    
    if (descriptionElement) {
      // Clear previous content
      descriptionElement.innerHTML = '';
      
      // Parse markdown to HTML
      const parsedHTML = marked.parse(data);
      descriptionElement.innerHTML = parsedHTML;
      
      // Show the results
      cardContent.classList.remove('hidden');
      
      // Smooth scroll to results
      resultsContainer.scrollIntoView({ behavior: 'smooth' });
      
      console.log('Data fetched successfully');
    } else {
      console.log('Element with class "description" not found');
      throw new Error('UI element not found');
    }
  } catch (error) {
    console.error('Error:', error);
    errorMessage.classList.remove('hidden');
    errorMessage.scrollIntoView({ behavior: 'smooth' });
  } finally {
    spinner.classList.add('hidden');
    spinner.classList.remove('flex');
  }
});

// Add focus effects for the input
cityInput.addEventListener('focus', () => {
  cityInput.classList.add('ring-2', 'ring-blue-500');
});

cityInput.addEventListener('blur', () => {
  cityInput.classList.remove('ring-2', 'ring-blue-500');
});

// Initialize with the input focused for immediate user interaction
window.addEventListener('load', () => {
  cityInput.focus();
});