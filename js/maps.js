// maps.js

// Constants for places (coordinates, names, etc.)
const HOME = {
    name: "Arreau (Base)",
    coordinates: { latitude: 42.9076, longitude: 0.3443 },
    id: "arreau-base"
}

const PLACES = [
    {
        name: "Saint-Lary Espiuabe 1600",
        coordinates: { latitude: 42.8256, longitude: 0.2601 },
        id: "saint-lary",
        url: "https://www.infonieve.es/estacion-esqui/saint-lary/"
    }
];

// Function to get place by name
function getPlaceByName(name) {
    return PLACES.find((place) => place.name === name);
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
export { HOME,PLACES, getPlaceByName, fetchRoute };
