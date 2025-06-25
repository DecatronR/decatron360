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
import {
  MapPin,
  Clock,
  Navigation,
  Users,
  Home,
  User,
  Building2,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Maximize2,
  Minimize2,
} from "lucide-react";
import getCoordinates from "utils/helpers/getCoordinates";
import { fetchBookingData } from "utils/api/inspection/fetchBookingData";
import { fetchPropertyData } from "utils/api/properties/fetchPropertyData";
import { fetchUserData } from "utils/api/user/fetchUserData";
import getRoutes from "utils/helpers/getRoutes";

const mapContainerStyle = { width: "100%", height: "100%" };

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const userId = sessionStorage.getItem("userId");
      try {
        const userData = await fetchUserData(userId);
        setUserRole(userData.role);
      } catch (error) {
        console.error("Failed to fetch user role", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRole();
  }, []);

  return { userRole, loading };
};

const useBookingData = (id) => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        const data = await fetchBookingData(id);
        setBookingData(data);
      } catch (error) {
        console.error("Failed to fetch booking data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  return { bookingData, loading };
};

const usePropertyData = (propertyID) => {
  const [propertyData, setPropertyData] = useState(null);
  const [propertyGeoJSON, setPropertyGeoJSON] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyID) return;

    const fetchPropertyLocation = async () => {
      try {
        const data = await fetchPropertyData(propertyID);
        setPropertyData(data.data);
        const { state, lga, neighbourhood } = data.data;
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
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyLocation();
  }, [propertyID]);

  return { propertyData, propertyGeoJSON, loading };
};

const useParticipantsData = (bookingData) => {
  const [agentData, setAgentData] = useState(null);
  const [buyerData, setBuyerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingData) return;

    const fetchParticipantsData = async () => {
      try {
        const promises = [];

        // Fetch agent data if agentID exists
        if (bookingData.agentID) {
          promises.push(
            fetchUserData(bookingData.agentID).then((data) => ({
              type: "agent",
              data,
            }))
          );
        }

        // Fetch buyer data if userID exists (assuming userID is the buyer)
        if (bookingData.userID) {
          promises.push(
            fetchUserData(bookingData.userID).then((data) => ({
              type: "buyer",
              data,
            }))
          );
        }

        const results = await Promise.all(promises);

        results.forEach((result) => {
          if (result.type === "agent") {
            setAgentData(result.data);
          } else if (result.type === "buyer") {
            setBuyerData(result.data);
          }
        });
      } catch (error) {
        console.error("Failed to fetch participants data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantsData();
  }, [bookingData]);

  return { agentData, buyerData, loading };
};

const StatusBadge = ({ status, children }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles()}`}
    >
      {children}
    </span>
  );
};

const InfoCard = ({ icon: Icon, title, value, subtitle }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="font-semibold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const ParticipantCard = ({
  role,
  name,
  phone,
  email,
  isOnline = false,
  profilePicture,
}) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
    <div className="flex items-start space-x-3">
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={`${name}'s profile`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`w-full h-full flex items-center justify-center ${
              profilePicture ? "hidden" : "flex"
            }`}
          >
            <User className="w-5 h-5 text-gray-600" />
          </div>
        </div>
        {isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <p className="font-semibold text-gray-900 truncate">{name}</p>
          <StatusBadge status={isOnline ? "active" : "pending"}>
            {isOnline ? "Online" : "Offline"}
          </StatusBadge>
        </div>
        <p className="text-sm text-gray-600 capitalize mb-2">{role}</p>
        <div className="space-y-1">
          {phone && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate break-all">{email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const InspectionTracker = () => {
  const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const { id } = useParams();

  const { userRole, loading: userRoleLoading } = useUserRole();
  const { bookingData, loading: bookingLoading } = useBookingData(id);
  const {
    propertyData,
    propertyGeoJSON,
    loading: propertyLoading,
  } = usePropertyData(bookingData?.propertyID);
  const {
    agentData,
    buyerData,
    loading: participantsLoading,
  } = useParticipantsData(bookingData);

  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [distance, setDistance] = useState(null);
  const [eta, setEta] = useState(null);
  const [inspectionStatus, setInspectionStatus] = useState("active");

  const socket = useWebSocket(baseUrl);

  const { isLoaded } = useLoadScript({ googleMapsApiKey: MAPS_API_KEY });
  const [agentLocation, setAgentLocation] = useState();
  const [buyerLocation, setBuyerLocation] = useState();
  const [userLocation, setUserLocation] = useState();
  const [routePath, setRoutePath] = useState([]);
  const [movingMarker, setMovingMarker] = useState(null);

  const propertyLocation = useMemo(() => {
    if (!propertyGeoJSON?.geometry?.coordinates) return null;
    return {
      lat: propertyGeoJSON.geometry.coordinates[0],
      lng: propertyGeoJSON.geometry.coordinates[1],
    };
  }, [propertyGeoJSON]);

  // Calculate distance and ETA
  useEffect(() => {
    if (userLocation && propertyLocation) {
      const R = 6371; // Earth's radius in km
      const dLat = ((propertyLocation.lat - userLocation.lat) * Math.PI) / 180;
      const dLon = ((propertyLocation.lng - userLocation.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((userLocation.lat * Math.PI) / 180) *
          Math.cos((propertyLocation.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceKm = R * c;
      setDistance(distanceKm.toFixed(1));

      // Estimate ETA (assuming 30 km/h average speed)
      const etaMinutes = Math.ceil(distanceKm * 2);
      setEta(etaMinutes);
    }
  }, [userLocation, propertyLocation]);

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
      title: "End Inspection?",
      text: "Are you sure you want to end this inspection? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, End Inspection",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed && socket) {
      setInspectionStatus("completed");
      socket.emit("endInspection");
      router.push(`/inspection/feedback/${id}`);
      Swal.fire(
        "Inspection Ended!",
        "You will be redirected to provide feedback.",
        "success"
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (
    !isLoaded ||
    userRoleLoading ||
    bookingLoading ||
    propertyLoading ||
    participantsLoading
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading inspection details...</p>
        </div>
      </div>
    );
  }

  if (isMapFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="relative w-full h-full">
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={() => setIsMapFullscreen(false)}
              className="bg-white rounded-lg p-2 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            zoom={14}
            center={mapCenter}
          >
            {propertyLocation && (
              <Marker position={propertyLocation} label="🏠" />
            )}
            {agentLocation && <Marker position={agentLocation} label="👨‍💼" />}
            {buyerLocation && <Marker position={buyerLocation} label="👤" />}
            {routePath.length > 0 && (
              <Polyline
                path={routePath}
                options={{ strokeColor: "#5a47fb", strokeWeight: 5 }}
              />
            )}
          </GoogleMap>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Inspection Tracking
                </h1>
                <p className="text-sm text-gray-600">
                  {propertyData?.neighbourhood}, {propertyData?.lga}
                </p>
              </div>
            </div>
            <StatusBadge status={inspectionStatus}>
              {inspectionStatus === "active" ? "Active" : "Completed"}
            </StatusBadge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Map and Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative">
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={() => setIsMapFullscreen(true)}
                    className="bg-white rounded-lg p-2 shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="h-[400px] sm:h-[500px]">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={14}
                    center={mapCenter}
                  >
                    {propertyLocation && (
                      <Marker position={propertyLocation} label="🏠" />
                    )}
                    {agentLocation && (
                      <Marker position={agentLocation} label="👨‍💼" />
                    )}
                    {buyerLocation && (
                      <Marker position={buyerLocation} label="👤" />
                    )}
                    {routePath.length > 0 && (
                      <Polyline
                        path={routePath}
                        options={{ strokeColor: "#5a47fb", strokeWeight: 5 }}
                      />
                    )}
                  </GoogleMap>
                </div>
              </div>
            </div>

            {/* Property Details */}
            {propertyData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Home className="w-6 h-6 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Property Details
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium text-gray-900">
                      {propertyData.neighbourhood}, {propertyData.lga},{" "}
                      {propertyData.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Property Type</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {propertyData.propertyType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-medium text-gray-900">
                      {propertyData.price?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {propertyData.listingType}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* End Inspection Button - Desktop Only */}
            <div className="hidden lg:flex justify-center">
              <button
                onClick={handleEndInspection}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg font-semibold text-lg flex items-center space-x-2"
              >
                <XCircle className="w-5 h-5" />
                <span>End Inspection</span>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Inspection Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Inspection Status
                </h2>
              </div>
              <div className="space-y-4">
                <InfoCard
                  icon={Navigation}
                  title="Distance to Property"
                  value={distance ? `${distance} km` : "Calculating..."}
                />
                <InfoCard
                  icon={Clock}
                  title="Estimated Time"
                  value={eta ? `${eta} minutes` : "Calculating..."}
                />
                <InfoCard
                  icon={Calendar}
                  title="Inspection Date"
                  value={
                    bookingData?.bookingDateTime
                      ? new Date(
                          bookingData.bookingDateTime
                        ).toLocaleDateString()
                      : "Not set"
                  }
                />
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Participants
                </h2>
              </div>
              <div className="space-y-4">
                {agentData && (
                  <ParticipantCard
                    role="Agent"
                    name={agentData.name || "Agent Name"}
                    phone={agentData.phone}
                    email={agentData.email}
                    isOnline={!!agentLocation}
                    profilePicture={agentData.passport}
                  />
                )}
                {buyerData && (
                  <ParticipantCard
                    role="Client"
                    name={buyerData.name || "Client Name"}
                    phone={buyerData.phone}
                    email={buyerData.email}
                    isOnline={!!buyerLocation}
                    profilePicture={buyerData.passport}
                  />
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Map Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🏠</span>
                  <span className="text-gray-600">Property Location</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">👨‍💼</span>
                  <span className="text-gray-600">Agent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">👤</span>
                  <span className="text-gray-600">Buyer/Client</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-1 bg-blue-600 rounded"></div>
                  <span className="text-gray-600">Route Path</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* End Inspection Button - Mobile Only */}
        <div className="mt-8 flex lg:hidden justify-center">
          <button
            onClick={handleEndInspection}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg font-semibold text-lg flex items-center space-x-2"
          >
            <XCircle className="w-5 h-5" />
            <span>End Inspection</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspectionTracker;
