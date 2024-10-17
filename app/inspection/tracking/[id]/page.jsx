"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import mapboxgl from "mapbox-gl";
import io from "socket.io-client";
import getCoordinates from "utils/helpers/getCoordinates";
import { fetchBookingData } from "utils/api/inspection/fetchBookingData";
import { fetchPropertyData } from "utils/api/properties/fetchPropertyData";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const InspectionTracker = ({ propertyLocation }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { id } = useParams();
  const [agentLocation, setAgentLocation] = useState(null);
  const [buyerLocation, setBuyerLocation] = useState(null);
  const [socket, setSocket] = useState(null);
  const mapContainerRef = useRef(null);
  const [propertyLatitude, setPropertyLatitude] = useState(null);
  const [propertyLongitude, setPropertyLongitude] = useState(null);
  const [bookingData, setBookingData] = useState({});
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");

  console.log("Booking id: ", id);

  useEffect(() => {
    if (!id) return;
    const handleFetchBookingData = async () => {
      try {
        const res = await fetchBookingData(id);
        console.log("Booking data: ", res);
        setBookingData(res);
      } catch (error) {
        console.log("Failed to fetch booking data: ", error);
      }
    };
    handleFetchBookingData();
  }, [id]);

  //fetch property location (neighbourhood, lga, state)
  useEffect(() => {
    if (bookingData.propertyID) {
      const handleFetchPropertyLocation = async () => {
        try {
          const res = await fetchPropertyData(bookingData.propertyID);
          console.log("Property data: ", res);
          setNeighbourhood(res.data.neighbourhood);
          setLga(res.data.lga);
          setState(res.data.state);
        } catch (error) {
          console.log("Failed to fetch property data: ", error);
        }
      };

      handleFetchPropertyLocation();
    }
  }, [bookingData.propertyID]);

  //geo code property location and store longitude and latitiude
  useEffect(() => {
    //temporarily removed the lga data to make sure the call passes
    if (state && neighbourhood) {
      const handleGetPropertyCoordinates = async () => {
        const propertyLocation = `${neighbourhood} ${lga} ${state}`;
        try {
          const res = await getCoordinates(propertyLocation);
          console.log("property coordinates: ", res);
          setPropertyLatitude(res.latitude);
          setPropertyLongitude(res.longitude);
        } catch (error) {
          console.log("Failed to get property location coordinates: ", error);
        }
      };

      handleGetPropertyCoordinates(); // Make sure to call the function
    }
  }, [state, lga, neighbourhood]);

  // Initialize WebSocket connection
  useEffect(() => {
    const socketInstance = io(baseUrl);
    setSocket(socketInstance);

    socketInstance.on("agentLocationUpdate", (location) => {
      setAgentLocation(location);
    });

    socketInstance.on("buyerLocationUpdate", (location) => {
      setBuyerLocation(location);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Function to get and emit location
  const fetchAndEmitLocation = (isAgent) => {
    navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Emit the location to the server
        if (isAgent && socket) {
          socket.emit("agentLocation", location);
        } else if (socket) {
          socket.emit("buyerLocation", location);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );
  };

  // Fetch and emit agent and buyer locations
  useEffect(() => {
    fetchAndEmitLocation(true); // For agent
    fetchAndEmitLocation(false); // For buyer
  }, [socket]);

  // Initialize Mapbox map
  useEffect(() => {
    if (mapContainerRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [propertyLongitude, propertyLatitude],
        zoom: 15,
      });

      // Add markers for property, agent, and buyer
      const propertyMarker = new mapboxgl.Marker()
        .setLngLat([propertyLongitude, propertyLatitude])
        .setPopup(new mapboxgl.Popup().setText("Property"))
        .addTo(map);

      // Update agent marker if location is available
      if (agentLocation) {
        new mapboxgl.Marker({ color: "blue" })
          .setLngLat([agentLocation.lng, agentLocation.lat])
          .setPopup(new mapboxgl.Popup().setText("Agent"))
          .addTo(map);
      }

      // Update buyer marker if location is available
      if (buyerLocation) {
        new mapboxgl.Marker({ color: "green" })
          .setLngLat([buyerLocation.lng, buyerLocation.lat])
          .setPopup(new mapboxgl.Popup().setText("Buyer"))
          .addTo(map);
      }

      // Clean up the map on component unmount
      return () => map.remove();
    }
  }, [propertyLocation, agentLocation, buyerLocation]);

  return (
    <div style={{ height: "100vh", width: "100%" }} ref={mapContainerRef}></div>
  );
};

export default InspectionTracker;
