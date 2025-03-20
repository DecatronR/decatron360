"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useLoadScript,
  Polyline,
} from "@react-google-maps/api";
import io from "socket.io-client";
import Swal from "sweetalert2";
import getCoordinates from "utils/helpers/getCoordinates";
import { fetchBookingData } from "utils/api/inspection/fetchBookingData";
import { fetchPropertyData } from "utils/api/properties/fetchPropertyData";
import { fetchUserData } from "utils/api/user/fetchUserData";
import getRoutes from "utils/helpers/getRoutes";

const mapContainerStyle = { width: "100%", height: "500px" };

const useWebSocket = (baseUrl) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(baseUrl);
    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, [baseUrl]);

  return socket;
};

const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const userId = sessionStorage.getItem("userId");
      try {
        const userData = await fetchUserData(userId);
        setUserRole(userData.role);
      } catch (error) {
        console.error("Failed to fetch user role", error);
      }
    };
    fetchUserRole();
  }, []);

  console.log("User role: ", userRole);
  return userRole;
};

const useBookingData = (id) => {
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        const data = await fetchBookingData(id);
        setBookingData(data);
      } catch (error) {
        console.error("Failed to fetch booking data", error);
      }
    };

    fetchBooking();
  }, [id]);

  return bookingData;
};

const usePropertyData = (propertyID) => {
  const [propertyGeoJSON, setPropertyGeoJSON] = useState(null);

  useEffect(() => {
    if (!propertyID) return;

    const fetchPropertyLocation = async () => {
      try {
        const propertyData = await fetchPropertyData(propertyID);
        const { state, lga, neighbourhood } = propertyData.data;
        const fullLocation = `${neighbourhood}, ${lga}, ${state}`;
        const coordinates = await getCoordinates(fullLocation);
        const geoJSON = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [coordinates.latitude, coordinates.longitude],
          },
          properties: {
            propertyID: propertyID,
          },
        };
        setPropertyGeoJSON(geoJSON);
      } catch (error) {
        console.error("Failed to fetch property location", error);
      }
    };

    fetchPropertyLocation();
  }, [propertyID]);

  console.log("Property Geo JSON: ", propertyGeoJSON);
  return propertyGeoJSON;
};

const InspectionTracker = () => {
  const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const { id } = useParams();

  const userRole = useUserRole();
  const bookingData = useBookingData(id);
  const propertyGeoJSON = usePropertyData(bookingData?.propertyID);
  const center = {
    lat: propertyGeoJSON?.geometry.coordinates[0],
    lng: propertyGeoJSON?.geometry.coordinates[1],
  };
  const [mapCenter, setMapCenter] = useState(center);

  console.log("Center: ", center);
  const socket = useWebSocket(baseUrl);

  const { isLoaded } = useLoadScript({ googleMapsApiKey: MAPS_API_KEY });
  const [agentLocation, setAgentLocation] = useState();
  const [buyerLocation, setBuyerLocation] = useState();

  const [userLocation, setUserLocation] = useState();
  const [routePath, setRoutePath] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [movingMarker, setMovingMarker] = useState(null);

  console.log("Agent location: ", agentLocation);
  console.log("Buyers location: ", buyerLocation);

  const propertyLocation = useMemo(() => {
    if (!propertyGeoJSON?.geometry?.coordinates) return null;
    return {
      lat: propertyGeoJSON.geometry.coordinates[0],
      lng: propertyGeoJSON.geometry.coordinates[1],
    };
  }, [propertyGeoJSON]);

  useEffect(() => {
    if (propertyGeoJSON) {
      setMapCenter({
        lat: propertyGeoJSON?.geometry.coordinates[0],
        lng: propertyGeoJSON?.geometry.coordinates[1],
      });
    }
  }, [propertyGeoJSON]);

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  useEffect(() => {
    if (!socket) return;

    socket.on("agentLocationUpdate", setAgentLocation);
    socket.on("buyerLocationUpdate", setBuyerLocation);

    return () => {
      socket.off("agentLocationUpdate", setAgentLocation);
      socket.off("buyerLocationUpdate", setBuyerLocation);
    };
  }, [socket]);

  // Watch User Location and Emit to Socket
  useEffect(() => {
    if (!userRole || !socket) return;

    const emitLocation = (position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      if (["agent", "owner", "property-manager"].includes(userRole)) {
        socket.emit("agentLocation", location);
      } else if (["buyer", "renter", "client"].includes(userRole)) {
        socket.emit("buyerLocation", location);
      }
    };

    const handleLocationError = (error) => {
      console.error("Error getting location", error);
    };

    navigator.geolocation.watchPosition(emitLocation, handleLocationError, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 5000,
    });
  }, [userRole, socket]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting user location:", error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (routePath.length === 0) return;

    let step = 0;
    const interval = setInterval(() => {
      if (step < routePath.length) {
        setMovingMarker(routePath[step]);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [routePath]);

  useEffect(() => {
    if (!userLocation || !propertyLocation) return;

    const fetchRoute = async () => {
      try {
        const routeData = await getRoutes(
          userLocation,
          propertyLocation,
          MAPS_API_KEY
        );

        if (routeData?.length > 0) {
          console.log("Updating routePath dynamically:", routeData);
          setRoutePath(routeData);
        }
      } catch (error) {
        console.error("Error fetching updated route:", error);
      }
    };

    fetchRoute();
  }, [userLocation, propertyLocation]);

  const handleEndInspection = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Please make sure you have completed the inspection.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, end it!",
    });

    if (result.isConfirmed && socket) {
      socket.emit("endInspection");
      router.push(`/inspection/feedback/${id}`);
      Swal.fire("Ended!", "Your inspection has ended.", "success");
    }
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
        center={mapCenter}
      >
        {/* Property Marker */}
        {propertyLocation && <Marker position={propertyLocation} label="🏠" />}

        {/* Agent Marker */}
        {agentLocation && <Marker position={agentLocation} label="👨‍💼" />}

        {/* Buyer Marker */}
        {buyerLocation && <Marker position={buyerLocation} label="👤" />}

        {/* Route Path */}
        {routePath.length > 0 && (
          <Polyline
            path={routePath}
            options={{ strokeColor: "#5a47fb", strokeWeight: 5 }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default InspectionTracker;
