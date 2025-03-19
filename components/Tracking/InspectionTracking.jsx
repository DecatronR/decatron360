"use client";

import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
import io from "socket.io-client";

const MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key

const mapContainerStyle = { width: "100%", height: "500px" };
const center = { lat: 40.7128, lng: -74.006 }; // Default center (New York City)

// Mocked real-time agent & buyer locations
const socket = io("http://localhost:4000"); // Replace with actual backend URL

const RealEstateMap = () => {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: MAPS_API_KEY });
  const [directions, setDirections] = useState(null);
  const [agentLocation, setAgentLocation] = useState({
    lat: 40.714,
    lng: -74.005,
  }); // Mock agent location
  const [buyerLocation, setBuyerLocation] = useState({
    lat: 40.71,
    lng: -74.007,
  }); // Mock buyer location

  const propertyLocation = { lat: 40.7128, lng: -74.006 }; // Property location

  useEffect(() => {
    if (!isLoaded) return;

    // Simulating real-time location updates
    socket.on("updateLocation", (data) => {
      setAgentLocation(data.agent);
      setBuyerLocation(data.buyer);
      calculateRoutes(data.agent, propertyLocation);
    });

    return () => socket.off("updateLocation");
  }, [isLoaded]);

  // Calculate route from agent to property
  const calculateRoutes = (start, end) => {
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") setDirections(result);
      }
    );
  };

  if (!isLoaded)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );

  return (
    <div className="w-full h-[500px] rounded-lg shadow-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={propertyLocation}
      >
        {/* Property Marker */}
        <Marker position={propertyLocation} label="🏠" />

        {/* Agent Marker */}
        <Marker position={agentLocation} label="👨‍💼" />

        {/* Buyer Marker */}
        <Marker position={buyerLocation} label="👤" />

        {/* Route from agent to property */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default RealEstateMap;
