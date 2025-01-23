import { HOME, PLACES, getPlaceByName, fetchRoute } from "./maps.js";
import { getCurrentWeather } from "./weather.js"; // Asegúrate de que weather.js está configurado

// Base configuration
const gApiKey='AIzaSyCjef5LPJpnTuyq1sbBDKTkK9TGCyCV--Y';

document.addEventListener("DOMContentLoaded", async () => {
    // Genera las tarjetas para cada estación
    const stationsContainer = document.getElementById("stations-container");

    PLACES.forEach(async (place) => {
        
        updateStationName(place.name, place.id);



        const card = createStationCard(place);
        //const mapCard = createMapCard(place);
        stationsContainer.appendChild(card);

        // Obtén la ruta y el clima para cada estación
        const basePlace = HOME;

        // Obtén el clima de la estación
        const weatherData = await getCurrentWeather(place.coordinates.latitude, place.coordinates.longitude);

        // Actualiza la tarjeta con el clima
        updateCardWithWeatherInfo(place.id, card, weatherData);

        // Obtén la ruta de Arreau a la estación
        const routeData = await fetchRoute(basePlace.coordinates, place.coordinates, gApiKey);

        // Actualiza la tarjeta con los datos de la ruta
        updateCardWithRouteInfo(card, place, routeData);
    });

    
});

function updateStationName(name, stationId) {
  const titleElement = document.querySelector(`#station-${stationId}-name`);
  titleElement.textContent = name;
}

// Función para crear una tarjeta de estación
function createStationCard(place) {
    const card = document.createElement("div");
    card.classList.add("station-card");
    card.id = place.id;

    card.innerHTML = `
        <h3>${place.name}</h3>
        <p><strong>Distancia:</strong> <span class="distance">Loading...</span></p>
        <p><strong>Tiempo de viaje:</strong> <span class="duration">Loading...</span></p>
        <p><strong>Clima:</strong> <span class="weather">Loading...</span></p>
        <p><strong>Web:</strong> <a class="weather" href="${place.url}" target="_blank" rel="noopener noreferrer">${place.url}</a></p>
        <div class="map" id="${place.id}-map" style="width: 100%; height: 150px;"></div>
        `;

    console.log("Generated card:", card); 
    return card;
}

// Función para actualizar la tarjeta con información de la ruta
function updateCardWithRouteInfo(card, place, routeData) {
    const mapCardElement = document.querySelector(`#station-${place.id}-map-card`);
    const durationElement = mapCardElement.querySelector(".route-time")
    const distanceElement = mapCardElement.querySelector(".route-distance")


    //const distanceElement = card.querySelector(".distance");
    //const durationElement = card.querySelector(".duration");

    if (routeData && routeData.routes && routeData.routes[0]) {
        const route = routeData.routes[0];
        const distance = (route.distanceMeters / 1000).toFixed(2) + " km";
        const duration = formatDuration(route.duration)

        distanceElement.textContent = `(${distance})`;
        durationElement.textContent = duration;

        initMap(place, route.polyline.encodedPolyline, HOME.coordinates);

    } else {
        distanceElement.textContent = "Error fetching route";
        durationElement.textContent = "Error fetching route";
    }
}

window.initMap = function(place, encodedPolyline, centerCoordinates) {
  const mapContainer = document.getElementById(`station-${place.id}-map`);
  if (!mapContainer) {
      console.error(`Map container not found for place: ${place.id}`);
      return;
  }

  // Create the map centered at a default location
  const map = new google.maps.Map(mapContainer, {
    center: { lat: centerCoordinates.latitude, lng: centerCoordinates.longitude },
    zoom: 12,
  });

  if (!encodedPolyline) {
      console.error("Encoded polyline is undefined or empty:", encodedPolyline);
      return;
  }

  // Decode the polyline
  try {
    var decodedPath = google.maps.geometry.encoding.decodePath(encodedPolyline);
  } catch (error) {
    console.error("Error decoding polyline:", error);
  }
    
  const polyline = new google.maps.Polyline({
    path: decodedPath,
    geodesic: true,
    strokeColor: "#00FF00", // Puede ser verde si no hay tráfico
    strokeOpacity: 1.0,
    strokeWeight: 4,
  });

  // Set the polyline on the map
  polyline.setMap(map);

  // Crea y agrega la capa de tráfico
  const trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);

  // Add origin and destination markers
  const originMarker = new google.maps.Marker({
    position: decodedPath[0], // Origen
    map: map,
    title: "Origin",
    icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
  });

  const destinationMarker = new google.maps.Marker({
    position: decodedPath[decodedPath.length - 1], // Destino
    map: map,
    title: "Destination",
    icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
  });

  // Ajustar el zoom para encuadrar origen y destino
  const bounds = new google.maps.LatLngBounds();
  bounds.extend(decodedPath[0]); // Agregar el origen
  bounds.extend(decodedPath[decodedPath.length - 1]); // Agregar el destino

  // Si deseas incluir toda la polilínea en el zoom:
  decodedPath.forEach((point) => bounds.extend(point));

  // Ajustar el mapa a los límites
  map.fitBounds(bounds);
}

function formatDuration(durationString) {
  // Eliminar la 's' final y convertir a número
  const seconds = parseInt(durationString.replace('s', ''), 10);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours > 0 ? hours + 'h ' : ''}${minutes}min`;
}


// Función para actualizar la tarjeta con el clima
function updateCardWithWeatherInfo(stationId, card, weatherData) {
    const weatherElement = card.querySelector(".weather");

    if (weatherData && weatherData.current) {
        const temperature = weatherData.current.temp_c + "°C";
        const condition = weatherData.current.condition.text;

        weatherElement.textContent = `${temperature}, ${condition}`;
    } else {
        weatherElement.textContent = "Error fetching weather";
    }

    updateWeatherCard(stationId, weatherData);


}

function updateWeatherCard(stationId, weatherData) {
  const weatherCard = document.querySelector(`#station-${stationId}-weather`);
  if (weatherCard && weatherData) {
      const temperature = `${weatherData.current.temp_c}°C`;
      const condition = weatherData.current.condition.text;
      const iconUrl = weatherData.current.condition.icon;

      weatherCard.innerHTML = `
          <div class="weather-info">
              <img src="https:${iconUrl}" alt="${condition}">
              <div>
                  <div class="temp">${temperature}</div>
                  <div class="condition">${condition}</div>
              </div>
          </div>
      `;
  }
}
