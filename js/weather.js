// js/weather.js

const apiKey = '18ed1cd4ccb74736b28214215251301';
const baseUrl = 'https://api.weatherapi.com/v1';

// Function to fetch current weather
async function getCurrentWeather(location) {
    const endpoint = `${baseUrl}/current.json?key=${apiKey}&q=${location}&aqi=no`;
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
async function getForecast(location, days = 3) {
    const endpoint = `${baseUrl}/forecast.json?key=${apiKey}&q=${location}&days=${days}&aqi=no&alerts=no`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error('Failed to fetch forecast data');
        }
    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
}
       
