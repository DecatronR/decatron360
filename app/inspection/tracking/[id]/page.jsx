"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import io from "socket.io-client";
import Swal from "sweetalert2";
import getCoordinates from "utils/helpers/getCoordinates";
import { fetchBookingData } from "utils/api/inspection/fetchBookingData";
import { fetchPropertyData } from "utils/api/properties/fetchPropertyData";
import { fetchUserData } from "utils/api/user/fetchUserData";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

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
        const fullLocation = `${neighbourhood} ${lga} ${state}`;
        const coordinates = await getCoordinates(fullLocation);
        const geoJSON = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [coordinates.longitude, coordinates.latitude],
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

  return propertyGeoJSON;
};

const InspectionTracker = () => {
  const router = useRouter();
  const { id } = useParams();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const userRole = useUserRole();
  const bookingData = useBookingData(id);
  const propertyGeoJSON = usePropertyData(bookingData?.propertyID);
  const socket = useWebSocket(baseUrl);

  const mapContainerRef = useRef(null);
  const [agentLocation, setAgentLocation] = useState(null);
  const [buyerLocation, setBuyerLocation] = useState(null);

  const agentMarker = document.createElement("div");
  agentMarker.className = "agent-marker";

  const buyerMarker = document.createElement("div");
  buyerMarker.className = "buyer-marker";

  // Watch User Location and Emit to Socket
  useEffect(() => {
    if (!userRole || !socket) return;

    const emitLocation = (position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      if (userRole === "agent") {
        socket.emit("agentLocation", location);
      } else if (userRole === "buyer") {
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

  // WebSocket for Receiving Location Updates
  useEffect(() => {
    if (!socket) return;

    socket.on("agentLocationUpdate", setAgentLocation);
    socket.on("buyerLocationUpdate", setBuyerLocation);

    return () => {
      socket.off("agentLocationUpdate", setAgentLocation);
      socket.off("buyerLocationUpdate", setBuyerLocation);
    };
  }, [socket]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || !propertyGeoJSON) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: propertyGeoJSON.geometry.coordinates,
      zoom: 15,
    });

    const propertyMarker = new mapboxgl.Marker()
      .setLngLat(propertyGeoJSON.geometry.coordinates)
      .setPopup(new mapboxgl.Popup().setText("Property Location"))
      .addTo(map);

    if (agentLocation) {
      const agentMarkerElement = new mapboxgl.Marker({
        element: agentMarker,
        anchor: "bottom",
      })
        .setLngLat([agentLocation.lng, agentLocation.lat])
        .addTo(map);
    }

    if (buyerLocation) {
      const buyerMarkerElement = new mapboxgl.Marker({
        element: buyerMarker,
        anchor: "bottom",
      })
        .setLngLat([buyerLocation.lng, buyerLocation.lat])
        .addTo(map);
    }

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      profile: "mapbox/driving",
    });

    map.addControl(directions, "top-left");

    if (agentLocation) {
      directions.setOrigin([agentLocation.lng, agentLocation.lat]);
    } else if (buyerLocation) {
      directions.setOrigin([buyerLocation.lng, buyerLocation.lat]);
    }

    directions.setDestination(propertyGeoJSON.geometry.coordinates);

    directions.on("route", (e) => {
      const route = e.route;
      map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: route.geometry,
          },
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#03a9f4",
          "line-width": 5,
        },
      });
      const distance = route.distance / 1000;
      const time = route.duration / 60;

      document.getElementById("distance").innerText = `${distance.toFixed(
        2
      )} km`;
      document.getElementById("time").innerText = `${time.toFixed(2)} minutes`;
    });

    return () => map.remove();
  }, [propertyGeoJSON, agentLocation, buyerLocation]);

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

  return (
    <div className="relative w-full h-screen">
      <h1 className="absolute top-5 left-5 text-2xl font-bold">
        Inspection Tracker
      </h1>
      <div ref={mapContainerRef} className="h-full w-full"></div>
      <button
        onClick={handleEndInspection}
        className="absolute top-5 right-5 px-4 py-2 text-white bg-red-500 rounded-md"
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
