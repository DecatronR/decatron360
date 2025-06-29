"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Spinner from "components/ui/Spinner";
import { useSnackbar } from "notistack";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import { fetchPropertyData } from "@/utils/api/properties/fetchPropertyData";
import { bookInspection } from "utils/api/inspection/bookInspection";
import { referralBookInspection } from "utils/api/inspection/referralBookInspection";
import { scheduleBooked } from "utils/api/scheduler/scheduleBooked";
import { sendNotification } from "@/utils/api/pushNotification/sendNotification";
import { fetchAgentSchedule } from "utils/api/scheduler/fetchAgentSchedule";
import { fetchReferrerSchedule } from "utils/api/scheduler/fetchReferrerSchedule";
import {
  getAgentInspectionBookedMessage,
  getClientInspectionConfirmedMessage,
} from "@/utils/notificationMessages/inspectionNotifications";
import { format } from "date-fns";
import { formatTime } from "@/utils/helpers/formatTime";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Edit3,
  Save,
  X,
  UserCheck,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

const NonPaymentInspectionBooking = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { id: propertyId } = useParams();
  const [user, setUser] = useState(null);
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInspectionConfirmed, setIsInspectionConfirmed] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDate, setEditedDate] = useState("");
  const [editedTime, setEditedTime] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState({});
  const [slotIds, setSlotIds] = useState({});
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Fetch user and property data when component mounts
  useEffect(() => {
    const fetchUserAndPropertyData = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        return;
      }

      try {
        const userResponse = await fetchUserData(userId);
        setUser(userResponse);

        const propertyResponse = await fetchPropertyData(propertyId);
        setProperty(propertyResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndPropertyData();
  }, [propertyId]);

  // Set initial date and time values from session storage
  useEffect(() => {
    const savedDate = sessionStorage.getItem("inspectionDate");
    const savedTime = sessionStorage.getItem("inspectionTime");

    if (savedDate) setEditedDate(savedDate);
    if (savedTime) setEditedTime(savedTime);
  }, []);

  // Fetch available slots when editing
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!isEditing) return;

      setIsLoadingSlots(true);
      try {
        const agentId = sessionStorage.getItem("agentId");
        const referralCode = sessionStorage.getItem("referralCode");

        let rawAvailability;
        if (referralCode) {
          rawAvailability = await fetchReferrerSchedule(referralCode);
        } else if (agentId) {
          rawAvailability = await fetchAgentSchedule(agentId);
        } else {
          setIsLoadingSlots(false);
          await Swal.fire({
            icon: "warning",
            title: "No Agent Found",
            text: "Unable to fetch available slots. Please try again or contact support.",
            confirmButtonText: "OK",
            confirmButtonColor: "#F59E0B",
          });
          return;
        }

        if (!rawAvailability || rawAvailability.length === 0) {
          await Swal.fire({
            icon: "warning",
            title: "No Available Slots",
            text: "No available inspection slots found. Please contact the agent for scheduling.",
            confirmButtonText: "OK",
            confirmButtonColor: "#F59E0B",
          });
          setIsLoadingSlots(false);
          return;
        }

        const newSlotIds = {};
        const formattedAvailability = rawAvailability.reduce((acc, slot) => {
          if (slot.isAvailable === "0") {
            const formattedDate = format(new Date(slot.date), "yyyy-MM-dd");
            const formattedTime = `${slot.time.padStart(2, "0")}:00`;

            acc[formattedDate] = acc[formattedDate] || [];
            acc[formattedDate].push(formattedTime);

            newSlotIds[formattedDate] = newSlotIds[formattedDate] || {};
            newSlotIds[formattedDate][formattedTime] = slot._id;
          }
          return acc;
        }, {});

        setAvailableDates(formattedAvailability);
        setSlotIds(newSlotIds);
      } catch (error) {
        console.error("Error fetching available slots:", error);
        await Swal.fire({
          icon: "error",
          title: "Error Loading Slots",
          text: "Failed to load available inspection slots. Please try again.",
          confirmButtonText: "OK",
          confirmButtonColor: "#EF4444",
        });
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [isEditing]);

  // Save edited data to state
  const handleSave = () => {
    const selectedSlotId = slotIds[editedDate]?.[editedTime];
    if (selectedSlotId) {
      sessionStorage.setItem("bookedSlotId", selectedSlotId);
      sessionStorage.setItem("inspectionDate", editedDate);
      sessionStorage.setItem("inspectionTime", editedTime);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset to original values
    const savedDate = sessionStorage.getItem("inspectionDate");
    const savedTime = sessionStorage.getItem("inspectionTime");
    setEditedDate(savedDate || "");
    setEditedTime(savedTime || "");
    setIsEditing(false);
  };

  const isDateAvailable = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return !!availableDates[formattedDate];
  };

  const isTimeAvailable = (time) => {
    if (!editedDate || !availableDates[editedDate]) return false;
    const formattedTime = format(time, "HH:mm");
    return availableDates[editedDate].some((slot) => slot === formattedTime);
  };

  const validateBookingData = (
    userId,
    propertyId,
    agentId,
    bookingDateTime
  ) => {
    if (!userId) {
      return false;
    }
    if (!propertyId) {
      return false;
    }
    if (!agentId) {
      return false;
    }
    if (!bookingDateTime) {
      return false;
    }
    return true;
  };

  const validateReferralBookingData = (
    userId,
    propertyId,
    referralCode,
    bookingDateTime
  ) => {
    if (!userId) {
      return false;
    }
    if (!propertyId) {
      return false;
    }
    if (!referralCode) {
      return false;
    }
    if (!bookingDateTime) {
      return false;
    }
    return true;
  };

  const handleBookInspection = async () => {
    const userId = sessionStorage.getItem("userId");
    const agentId = sessionStorage.getItem("agentId");
    const bookingDateTime = new Date(
      `${editedDate}T${editedTime}:00`
    ).toISOString();

    const isValid = validateBookingData(
      userId,
      propertyId,
      agentId,
      bookingDateTime
    );
    if (!isValid) return;

    try {
      const bookingId = await bookInspection(
        userId,
        propertyId,
        agentId,
        bookingDateTime
      );
      // --- Notification logic ---
      // Fetch agent and client data
      const [agentData, clientData] = await Promise.all([
        fetchUserData(agentId),
        fetchUserData(userId),
      ]);
      // Format date/time for message
      const dateStr = editedDate;
      const timeStr = editedTime;
      // Notify agent
      if (agentData?.fcmToken) {
        const msg = getAgentInspectionBookedMessage(
          property?.data?.title || "Property",
          dateStr,
          timeStr
        );
        await sendNotification({
          fcmToken: agentData.fcmToken,
          title: msg.title,
          body: msg.body,
          data: {
            type: "inspection",
            route: `/my-inspections/${agentData._id}`,
          },
        });
      }
      // Notify client
      if (clientData?.fcmToken) {
        const msg = getClientInspectionConfirmedMessage(
          property?.data?.title || "Property",
          dateStr,
          timeStr
        );
        await sendNotification({
          fcmToken: clientData.fcmToken,
          title: msg.title,
          body: msg.body,
          data: {
            type: "inspection",
            route: `/my-inspections/${clientData._id}`,
          },
        });
      }
      // --- End notification logic ---
      return bookingId;
    } catch (error) {
      console.error("Failed to book inspection", error);
      throw new Error("Booking failed");
    }
  };

  const handleReferaralBookInspection = async () => {
    const userId = sessionStorage.getItem("userId");
    const referralCode = sessionStorage.getItem("referralCode");
    const bookingDateTime = new Date(
      `${editedDate}T${editedTime}:00`
    ).toISOString();

    const isValid = validateReferralBookingData(
      userId,
      propertyId,
      referralCode,
      bookingDateTime
    );
    if (!isValid) return;

    try {
      const bookingId = await referralBookInspection(
        userId,
        propertyId,
        referralCode,
        bookingDateTime
      );
      return bookingId;
    } catch (error) {
      console.error("Failed to book inspection", error);
      throw new Error("Booking failed");
    }
  };

  const handleBookedSlot = async () => {
    const bookedSlotId = sessionStorage.getItem("bookedSlotId");
    try {
      await scheduleBooked(bookedSlotId);
    } catch (error) {
      console.error(
        "Failed to schedule book inspection on agent calender: ",
        error
      );
    }
  };

  const handleConfirmBooking = async () => {
    setIsButtonLoading(true);
    try {
      const referralCode = sessionStorage.getItem("referralCode");

      if (referralCode) {
        await handleReferaralBookInspection();
        await handleBookedSlot();

        const result = await Swal.fire({
          icon: "success",
          title: "Booking Successful!",
          text: "Your inspection has been successfully booked with your referrer.",
          showCancelButton: true,
          confirmButtonText: "View My Inspections",
          cancelButtonText: "Go Home",
          confirmButtonColor: "#3B82F6",
          cancelButtonColor: "#6B7280",
          reverseButtons: true,
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });

        if (result.isConfirmed) {
          const userId = sessionStorage.getItem("userId");
          if (userId) {
            router.push(`/my-inspections/${userId}`);
          } else {
            // Fallback to home page if userId is not available
            router.push("/");
          }
        } else {
          router.push("/");
        }
      } else {
        await handleBookInspection();
        await handleBookedSlot();

        const result = await Swal.fire({
          icon: "success",
          title: "Booking Successful!",
          text: "Your inspection has been successfully booked with the lister of this property.",
          showCancelButton: true,
          confirmButtonText: "View My Inspections",
          cancelButtonText: "Go Home",
          confirmButtonColor: "#3B82F6",
          cancelButtonColor: "#6B7280",
          reverseButtons: true,
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });

        if (result.isConfirmed) {
          const userId = sessionStorage.getItem("userId");
          if (userId) {
            router.push(`/my-inspections/${userId}`);
          } else {
            // Fallback to home page if userId is not available
            router.push("/");
          }
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Failed to book inspection:", error);

      await Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: "There was an error processing your booking. Please try again or contact support.",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    } finally {
      setIsButtonLoading(false);
    }
  };

  const { propertyTitle, state, lga, neighbourhood } = property
    ? {
        propertyTitle: property.data.title,
        state: property.data.state,
        lga: property.data.lga,
        neighbourhood: property.data.neighbourhood,
      }
    : {};

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <UserCheck className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Confirm Your Booking
          </h1>
          <p className="text-gray-600">
            Review your inspection details and confirm your free booking
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Property Details Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {propertyTitle}
                </h2>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>
                    {neighbourhood}, {lga}, {state}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={isButtonLoading}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isEditing
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </>
                )}
              </button>
            </div>

            {/* Date & Time Display/Edit */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                <div className="flex-1">
                  <span className="text-sm text-gray-600">
                    Inspection Date:
                  </span>
                  {isEditing ? (
                    <div className="mt-1">
                      {isLoadingSlots ? (
                        <div className="w-full px-3 py-2 bg-gray-100 rounded-lg animate-pulse">
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                      ) : Object.keys(availableDates).length === 0 ? (
                        <div className="w-full px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            No available dates found. Please contact the agent
                            for scheduling.
                          </p>
                        </div>
                      ) : (
                        <DatePicker
                          selected={editedDate ? new Date(editedDate) : null}
                          onChange={(date) =>
                            setEditedDate(date.toISOString().split("T")[0])
                          }
                          filterDate={isDateAvailable}
                          minDate={new Date()}
                          maxDate={
                            new Date(
                              new Date().setDate(new Date().getDate() + 30)
                            )
                          }
                          placeholderText="Select available date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          disabled={isLoadingSlots}
                        />
                      )}
                    </div>
                  ) : (
                    <span className="ml-2 font-medium text-gray-900">
                      {editedDate
                        ? new Date(editedDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Loading..."}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-500 mr-3" />
                <div className="flex-1">
                  <span className="text-sm text-gray-600">
                    Inspection Time:
                  </span>
                  {isEditing ? (
                    <div className="mt-1">
                      {isLoadingSlots ? (
                        <div className="w-full px-3 py-2 bg-gray-100 rounded-lg animate-pulse">
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                      ) : (
                        <select
                          value={editedTime}
                          onChange={(e) => setEditedTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Select time</option>
                          {editedDate &&
                            availableDates[editedDate]?.map((time) => (
                              <option key={time} value={time}>
                                {formatTime(time)}
                              </option>
                            ))}
                        </select>
                      )}
                    </div>
                  ) : (
                    <span className="ml-2 font-medium text-gray-900">
                      {editedTime ? formatTime(editedTime) : "Loading..."}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Save/Cancel buttons for editing */}
            {isEditing && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSave}
                  disabled={!editedDate || !editedTime || isLoadingSlots}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Free Booking Notice */}
          <div className="p-6 border-b border-gray-100 bg-green-50">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-1">
                  Free Inspection
                </h3>
                <p className="text-green-700">
                  This property offers free inspections. No payment required.
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Checkboxes */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmation
            </h3>
            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={isInspectionConfirmed}
                  onChange={() =>
                    setIsInspectionConfirmed(!isInspectionConfirmed)
                  }
                  disabled={isButtonLoading}
                  className="mt-1 mr-3 w-5 h-5 text-primary-600 focus:ring-2 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">
                  I confirm the inspection details and understand the booking
                  terms.
                </span>
              </label>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={isTermsAccepted}
                  onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                  disabled={isButtonLoading}
                  className="mt-1 mr-3 w-5 h-5 text-primary-600 focus:ring-2 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">
                  I agree to the Terms and Conditions and Privacy Policy.
                </span>
              </label>
            </div>
          </div>

          {/* Confirm Booking Button */}
          <div className="p-6">
            <button
              onClick={handleConfirmBooking}
              disabled={
                !isTermsAccepted || !isInspectionConfirmed || isButtonLoading
              }
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center ${
                !isTermsAccepted || !isInspectionConfirmed || isButtonLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {isButtonLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Confirming Booking...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirm Free Booking
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Your booking will be confirmed immediately
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonPaymentInspectionBooking;
