// js/weather.js

const apiKey = '18ed1cd4ccb74736b28214215251301';
const baseUrl = 'https://api.weatherapi.com/v1';

// Function to fetch current weather
async function getCurrentWeather(latitude, longitude) {
    const endpoint = `${baseUrl}/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Function to fetch forecast
async function getForecast(latitude, longitude, days = 3) {
    const endpoint = `${baseUrl}/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=${days}&aqi=no&alerts=no`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error('Failed to fetch forecast data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
}

// Export constants and functions
export { getCurrentWeather, getForecast};
       
