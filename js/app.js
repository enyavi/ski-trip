import { PLACES, getPlaceByName, fetchRoute } from "./maps.js";
import { getCurrentWeather } from "./weather.js"; // Asegúrate de que weather.js está configurado

// Base configuration
const gApiKey='AIzaSyCjef5LPJpnTuyq1sbBDKTkK9TGCyCV--Y';

document.addEventListener("DOMContentLoaded", async () => {
    // Genera las tarjetas para cada estación
    const stationsContainer = document.getElementById("stations-container");

    PLACES.forEach(async (place) => {
        const card = createStationCard(place);
        stationsContainer.appendChild(card);

        // Obtén la ruta y el clima para cada estación
        const basePlace = getPlaceByName("Arreau (Base)");

        // Obtén la ruta de Arreau a la estación
        const routeData = await fetchRoute(basePlace.coordinates, place.coordinates, gApiKey);

        // Actualiza la tarjeta con los datos de la ruta
        updateCardWithRouteInfo(card, routeData);

        // Obtén el clima de la estación
        const weatherData = await getCurrentWeather(place.coordinates.latitude, place.coordinates.longitude);

        // Actualiza la tarjeta con el clima
        updateCardWithWeatherInfo(card, weatherData);
    });
});

// Función para crear una tarjeta de estación
function createStationCard(place) {
    const card = document.createElement("div");
    card.classList.add("station-card");
    card.id = place.id;

    card.innerHTML = `
        <h3>${place.name}</h3>
        <p><strong>Distance:</strong> <span class="distance">Loading...</span></p>
        <p><strong>Duration:</strong> <span class="duration">Loading...</span></p>
        <p><strong>Weather:</strong> <span class="weather">Loading...</span></p>
        <p><strong>Web:</strong> <a class="weather" href="${place.url}" target="_blank" rel="noopener noreferrer">${place.url}</a></p>
        <div class="map" id="${place.id}-map" style="width: 100%; height: 150px;"></div>
    `;

    return card;
}

// Función para actualizar la tarjeta con información de la ruta
function updateCardWithRouteInfo(card, routeData) {
    const distanceElement = card.querySelector(".distance");
    const durationElement = card.querySelector(".duration");

    if (routeData && routeData.routes && routeData.routes[0]) {
        const route = routeData.routes[0];
        const distance = (route.distanceMeters / 1000).toFixed(2) + " km";
        const duration = Math.round(route.duration / 60) + " minutes";

        distanceElement.textContent = distance;
        durationElement.textContent = duration;
    } else {
        distanceElement.textContent = "Error fetching route";
        durationElement.textContent = "Error fetching route";
    }
}

// Función para actualizar la tarjeta con el clima
function updateCardWithWeatherInfo(card, weatherData) {
    const weatherElement = card.querySelector(".weather");

    if (weatherData && weatherData.current) {
        const temperature = weatherData.current.temp_c + "°C";
        const condition = weatherData.current.condition.text;

        weatherElement.textContent = `${temperature}, ${condition}`;
    } else {
        weatherElement.textContent = "Error fetching weather";
    }
}
