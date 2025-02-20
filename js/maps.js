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
        id: "s1",
        url: "https://www.infonieve.es/estacion-esqui/saint-lary/"
    },
    {
        name: "Peyragudes",
        coordinates: { latitude: 42.7912, longitude: 0.4464 },
        id: "s2",
        url: "https://www.infonieve.es/estacion-esqui/peyragudes/parte-de-nieve/"
    },
    {
        name: "Piau Engaly",
        coordinates: { latitude: 42.7839, longitude: 0.1586 },
        id: "s3",
        url: "https://www.infonieve.es/estacion-esqui/piau-engaly/"
    },
    {
        name: "Superbagneres",
        coordinates: { latitude: 42.7683, longitude: 0.5771 },
        id: "s4",
        url: "https://www.infonieve.es/estacion-esqui/luchon-superbagneres/"
    },
    {
        name: "Grand Tourmalet",
        coordinates: { latitude: 42.9105, longitude: 0.1711 },
        id: "s5",
        url: "https://www.infonieve.es/estacion-esqui/grand-tourmalet/"
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
