// Base configuration
const stations = [
    { name: "Station 1", location: "45.923,0.923" },
    { name: "Station 2", location: "45.000,0.000" },
    { name: "Station 3", location: "46.123,1.123" },
    { name: "Station 4", location: "46.543,1.543" },
    { name: "Station 5", location: "47.000,2.000" },
  ];
  const origin = "Arreau, France"; // Update with the exact address
  const maps = {}; // Store map instances
  
  // Initialize map for each station
  function initMaps() {
    stations.forEach((station, index) => {
      const mapDiv = document.getElementById(`station${index + 1}-map`);
      maps[station.name] = new google.maps.Map(mapDiv, {
        center: { lat: parseFloat(station.location.split(",")[0]), lng: parseFloat(station.location.split(",")[1]) },
        zoom: 10,
      });
    });
  }
  
  // Fetch Routes API for traffic data
  async function fetchTrafficData(destination, map, stationId) {
    const url = `https://routes.googleapis.com/directions/v2:computeRoutes?key=YOUR_GOOGLE_MAPS_API_KEY`;
    const payload = {
      origin: { location: { latLng: { latitude: 42.9061, longitude: 0.364 } } }, // Replace with Arreau coordinates
      destination: { location: { latLng: { latitude: parseFloat(destination.split(",")[0]), longitude: parseFloat(destination.split(",")[1]) } } },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
    };
  
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    const travelTime = data.routes[0].legs[0].duration.text;
  
    // Update the travel time in the card
    document.getElementById(`${stationId}-traffic`).textContent = `Travel time: ${travelTime}`;
  
    // Draw the route on the map
    const directionsRenderer = new google.maps.DirectionsRenderer({ map, polylineOptions: { strokeColor: "#ff0000" } });
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: "DRIVING",
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        }
      }
    );
  }
  
  // Main function to update all data
  async function updateStationData() {
    stations.forEach((station, index) => {
      fetchTrafficData(station.location, maps[station.name], `station${index + 1}`);
    });
  }

  // js/app.js

document.addEventListener('DOMContentLoaded', async () => {
    const stations = [
        { name: 'Station 1', location: 'Arreau' },
        { name: 'Station 2', location: 'Saint-Lary-Soulan' },
        { name: 'Station 3', location: 'Peyragudes' },
        { name: 'Station 4', location: 'Piau Engaly' },
    ];

    const weatherContainer = document.getElementById('weather-cards');

    initMaps();
    document.getElementById("update").addEventListener("click", updateStationData);


    for (const station of stations) {
        const weatherData = await getCurrentWeather(station.location);

        const card = document.createElement('div');
        card.className = 'weather-card';

        card.innerHTML = `
            <h3>${station.name}</h3>
            <p>${weatherData.location.name}, ${weatherData.location.country}</p>
            <p><strong>Temp:</strong> ${weatherData.current.temp_c}°C</p>
            <p><strong>Condition:</strong> ${weatherData.current.condition.text}</p>
            <img src="${weatherData.current.condition.icon}" alt="${weatherData.current.condition.text}" />
        `;

        weatherContainer.appendChild(card);
    }
});

  