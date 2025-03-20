import axios from "axios";

const getCoordinates = async (address) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Use your Google Maps API Key

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: { address, key: apiKey },
      }
    );

    if (response.data.status === "OK" && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } else {
      throw new Error("Unable to get coordinates");
    }
  } catch (error) {
    throw new Error("Geocoding request failed");
  }
};

export default getCoordinates;
