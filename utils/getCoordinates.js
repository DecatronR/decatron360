import axios from "axios";

const getCoordinates = async (address) => {
  const apiKey = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${apiKey}`
  );

  if (response.data.features.length > 0) {
    const location = response.data.features[0].geometry.coordinates;
    return {
      latitude: location[1], // latitude is the second element
      longitude: location[0], // longitude is the first element
    };
  } else {
    throw new Error("Unable to get coordinates");
  }
};

export default getCoordinates;
