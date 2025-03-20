import axios from "axios";
import polyline from "@mapbox/polyline";

const getRoutes = async (origin, destination, apiKey) => {
  if (!origin || !destination || !apiKey) {
    console.error("Missing required parameters for getDirections");
    return null;
  }

  const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;

  const requestBody = {
    origin: {
      location: { latLng: { latitude: origin.lat, longitude: origin.lng } },
    },
    destination: {
      location: {
        latLng: { latitude: destination.lat, longitude: destination.lng },
      },
    },
    travelMode: "DRIVE",
    computeAlternativeRoutes: false,
    routeModifiers: { avoidTolls: false, avoidHighways: false },
    languageCode: "en-US",
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "routes.polyline",
      },
    });

    const data = response.data;
    if (!data.routes || data.routes.length === 0)
      throw new Error("No routes found");

    const encodedPolyline = data.routes[0].polyline.encodedPolyline;

    // Decode polyline into an array of coordinates
    return polyline.decode(encodedPolyline).map(([lat, lng]) => ({ lat, lng }));
  } catch (error) {
    console.error(
      "Error fetching directions:",
      error.response?.data || error.message
    );
    return null;
  }
};

export default getRoutes;
