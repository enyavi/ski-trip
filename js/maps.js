// maps.js

// Constants for places (coordinates, names, etc.)
const PLACES = [
    {
        name: "Saint-Lary-Soulan",
        coordinates: { latitude: 42.8165, longitude: 0.3227 },
        id: "saint-lary",
        url: "https://www.infonieve.es/estacion-esqui/saint-lary/"
    },
    {
        name: "Arreau (Base)",
        coordinates: { latitude: 42.9076, longitude: 0.3443 },
        id: "arreau-base"
    },
];

// Function to get place by name
function getPlaceByName(name) {
    return PLACES.find((place) => place.name === name);
}

// Function to initialize Google Maps
function initializeMap(containerId, centerCoordinates, zoomLevel = 10) {
    return new google.maps.Map(document.getElementById(containerId), {
        center: centerCoordinates,
        zoom: zoomLevel,
    });
}

// Function to fetch route details using Google Routes API
async function fetchRoute(origin, destination, apiKey) {
    const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;

    const body = {
        origin: { location: { latLng: origin } },
        destination: { location: { latLng: destination } },
        travelMode: "DRIVE",
    };

    const headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline",
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch route data");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching route:", error);
    }
}

// Export constants and functions
export { PLACES, getPlaceByName, initializeMap, fetchRoute };
