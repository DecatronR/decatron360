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
import { fetchUserData } from "utils/api/user/fetchUserData";
import zIndex from "@mui/material/styles/zIndex";

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
  const [userRole, setUserRole] = useState(null);

  console.log("Booking id: ", id);

  // Fetch User Data
  useEffect(() => {
    const handleFetchUserData = async () => {
      const userId = sessionStorage.getItem("userId");
      try {
        const res = await fetchUserData(userId);
        console.log("User role: ", res.role);
        setUserRole(res.role);
      } catch (error) {
        console.log("Failed to fetch user role: ", error);
      }
    };
    handleFetchUserData();
  }, []);

  // Fetch Booking Data
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

  // Fetch Property Location
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

  // Get Property Coordinates
  useEffect(() => {
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

    // Listen for location updates from the server
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

  // Function to get and emit location based on role
  const fetchAndEmitLocation = () => {
    navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        console.log("Emitting location:", location);

        // Emit the location to the server based on the user's role
        if (userRole === "agent" && socket) {
          socket.emit("agentLocation", location);
          console.log("Emitted agent location");
        } else if (userRole === "buyer" && socket) {
          socket.emit("buyerLocation", location);
          console.log("Emitted buyer location");
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

  // Fetch and emit location based on user role
  useEffect(() => {
    if (userRole) {
      fetchAndEmitLocation(); // Fetch location for agent or buyer
    }
  }, [userRole, socket]);

  // Initialize Mapbox map
  useEffect(() => {
    if (mapContainerRef.current && propertyLatitude && propertyLongitude) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [propertyLongitude, propertyLatitude],
        zoom: 15,
      });

      // Add marker for the property
      const propertyMarker = new mapboxgl.Marker()
        .setLngLat([propertyLongitude, propertyLatitude])
        .setPopup(new mapboxgl.Popup().setText("Property Location"))
        .addTo(map);

      // Define GeoJSON source for the line between property, agent, and buyer
      const lineData = {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [[propertyLongitude, propertyLatitude]],
          },
        },
      };

      map.on("load", () => {
        // Add the line to the map
        map.addSource("route", lineData);
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#888",
            "line-width": 4,
          },
        });

        // Add agent and buyer markers dynamically
        let agentMarker, buyerMarker;

        if (agentLocation) {
          agentMarker = new mapboxgl.Marker({ color: "blue" })
            .setLngLat([agentLocation.lng, agentLocation.lat])
            .setPopup(new mapboxgl.Popup().setText("Agent"))
            .addTo(map);
        }

        if (buyerLocation) {
          buyerMarker = new mapboxgl.Marker({ color: "green" })
            .setLngLat([buyerLocation.lng, buyerLocation.lat])
            .setPopup(new mapboxgl.Popup().setText("Buyer"))
            .addTo(map);
        }

        // Update the line coordinates as agent and buyer move
        const updateLine = () => {
          const newCoordinates = [[propertyLongitude, propertyLatitude]]; // Start with property location

          if (agentLocation) {
            newCoordinates.push([agentLocation.lng, agentLocation.lat]);
          }

          if (buyerLocation) {
            newCoordinates.push([buyerLocation.lng, buyerLocation.lat]);
          }

          // Update the source data for the line
          map.getSource("route").setData({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: newCoordinates,
            },
          });
        };

        // Watch for changes in agent or buyer locations
        if (agentLocation || buyerLocation) {
          updateLine(); // Initial line update
        }

        // If agent location updates
        socket.on("agentLocationUpdate", (location) => {
          setAgentLocation(location);
          if (agentMarker) {
            agentMarker.setLngLat([location.lng, location.lat]);
          }
          updateLine(); // Update line with new location
        });

        // If buyer location updates
        socket.on("buyerLocationUpdate", (location) => {
          setBuyerLocation(location);
          if (buyerMarker) {
            buyerMarker.setLngLat([location.lng, location.lat]);
          }
          updateLine(); // Update line with new location
        });

        // Clean up the map on component unmount
        return () => {
          map.remove();
        };
      });
    }
  }, [propertyLatitude, propertyLongitude, agentLocation, buyerLocation]);

  // Function to end inspection
  const endInspection = () => {
    if (socket) {
      socket.emit("endInspection");
    }
    // Optionally redirect or navigate away from the inspection tracker page
    console.log("Inspection ended.");
  };

  return (
    <div className="relative w-full h-screen">
      <h1 className="absolute top-5 left-5 text-2xl font-bold">
        Inspection Tracker
      </h1>
      <div style={{ height: "100vh", width: "100%" }} ref={mapContainerRef} />

      <button
        onClick={endInspection}
        className="absolute top-5 right-5 px-4 py-2 text-white bg-red-500 border-2 rounded-md cursor-pointer z-10"
      >
        End Inspection
      </button>
      <a href="/" className="absolute top-5 left-5">
        <FontAwesomeIcon icon={faHome} size="2x" />
      </a>
    </div>
  );
};

export default InspectionTracker;
