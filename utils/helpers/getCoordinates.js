import axios from "axios";

const getCoordinates = async (address) => {
  const apiKey = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const country = "NG";

  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${apiKey}&country=${country}`
  );

  if (response.data.features.length > 0) {
    const location = response.data.features[0].geometry.coordinates;
    return {
      longitude: location[0],
      latitude: location[1],
    };
  } else {
    throw new Error("Unable to get coordinates");
  }
};

export default getCoordinates;
