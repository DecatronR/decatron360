"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
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

      handleGetPropertyCoordinates();
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
    if (mapContainerRef.current && propertyLatitude && propertyLongitude) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [propertyLongitude, propertyLatitude], // Center the map on the property location
        zoom: 15,
      });

      // Add marker for the property
      const propertyMarker = new mapboxgl.Marker()
        .setLngLat([propertyLongitude, propertyLatitude])
        .setPopup(new mapboxgl.Popup().setText("Property Location")) // Add a popup for the property marker
        .addTo(map);

      // Add markers for agent and buyer if available
      if (agentLocation) {
        new mapboxgl.Marker({ color: "blue" })
          .setLngLat([agentLocation.lng, agentLocation.lat])
          .setPopup(new mapboxgl.Popup().setText("Agent"))
          .addTo(map);
      }

      if (buyerLocation) {
        new mapboxgl.Marker({ color: "green" })
          .setLngLat([buyerLocation.lng, buyerLocation.lat])
          .setPopup(new mapboxgl.Popup().setText("Buyer"))
          .addTo(map);
      }

      // Clean up the map on component unmount
      return () => map.remove();
    }
  }, [propertyLatitude, propertyLongitude, agentLocation, buyerLocation]);

  return (
    <div style={{ height: "100vh", width: "100%" }} ref={mapContainerRef}></div>
  );
};

export default InspectionTracker;
