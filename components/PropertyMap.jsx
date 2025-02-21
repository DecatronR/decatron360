"use client";

import pin from "@/assets/images/pin.svg";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fromAddress, setDefaults } from "react-geocode";
import Map, { Marker } from "react-map-gl";
import Spinner from "./ui/Spinner";

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
    width: "100%",
    height: "500px",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);

  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
    language: "en",
    region: "us",
  });

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await fromAddress(
          //add  zipcode later
          `${property.neighbourhood} ${property.lgs} ${property.state}`
        );

        //  Check for results
        if (res.results.length === 0) {
          // No results found
          setGeocodeError(true);
          setIsLoading(false);
          return;
        }

        const { lat, lng } = res.results[0].geometry.location;

        setLat(lat);
        setLng(lng);
        setViewport({
          ...viewport,
          latitude: lat,
          longitude: lng,
        });

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setGeocodeError(true);
        setIsLoading(false);
      }
    };

    fetchCoords();
  }, []);

  if (isLoading) return <Spinner loading={isLoading} />;

  // Handle case where geocoding failed
  if (geocodeError) {
    return <div className="text-xl">No location data found</div>;
  }

  return (
    !isLoading && (
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapLib={import("mapbox-gl")}
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: 15,
        }}
        style={{ width: "100%", height: 500 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker longitude={lng} latitude={lat} anchor="bottom">
          <Image src={pin} alt="location" width={40} height={40} />
        </Marker>
      </Map>
    )
  );
};

export default PropertyMap;
