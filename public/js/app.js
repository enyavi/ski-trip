// Base configuration
const stations = [
    { name: "Station 1", location: "45.923,0.923" },
    { name: "Station 2", location: "45.000,0.000" },
    { name: "Station 3", location: "46.123,1.123" },
    { name: "Station 4", location: "46.543,1.543" },
    { name: "Station 5", location: "47.000,2.000" },
  ];
  const origin = "Arreau, France"; // Update with the exact address
  
  // API keys
  const weatherApiKey = "YOUR_WEATHER_API_KEY"; // Replace with your OpenWeatherMap API key
  
  // Function to fetch weather data
  async function fetchWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    return `${data.main.temp}°C, ${data.weather[0].description}`;
  }
  
  // Function to fetch traffic data from Google Maps
  async function fetchDistance(destination)
  