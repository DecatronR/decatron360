"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { useSnackbar } from "notistack";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import { fetchPropertyData } from "@/utils/api/properties/fetchPropertyData";
import { bookInspection } from "utils/api/inspection/bookInspection";
import { scheduleBooked } from "utils/api/scheduler/scheduleBooked";

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

  // Save edited data to state
  const handleSave = () => {
    setInspectionData({
      ...inspectionData,
      date: editedDate,
      time: editedTime,
    });
    setIsEditing(false);
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
    try {
      const res = await handleBookInspection();
      await handleBookedSlot();
      enqueueSnackbar("Your inspection has been successfully booked!", {
        variant: "success",
      });
      router.push("/inspection/success");
    } catch (error) {
      enqueueSnackbar("Failed to book inspection after payment", {
        variant: "error",
      });
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
    return <Spinner />;
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Booking Summary</h1>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{propertyTitle}</h2>
            <p className="text-gray-700 mb-2">
              Location: {neighbourhood}, {lga}, {state}
            </p>
            <div className="text-gray-700">
              <p>
                Inspection Date:{" "}
                {isEditing ? (
                  <input
                    type="date"
                    value={editedDate}
                    onChange={(e) => setEditedDate(e.target.value)}
                    className="border rounded-md p-2 w-full"
                  />
                ) : (
                  editedDate || "Loading..."
                )}
              </p>
              <p>
                Inspection Time:{" "}
                {isEditing ? (
                  <input
                    type="time"
                    value={editedTime}
                    onChange={(e) => setEditedTime(e.target.value)}
                    className="border rounded-md p-2 w-full"
                  />
                ) : (
                  editedTime || "Loading..."
                )}
              </p>
            </div>
            {isEditing ? (
              <button onClick={handleSave} className="mt-2 text-blue-600">
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 text-blue-600"
              >
                Edit
              </button>
            )}
          </div>

          {/* Confirmation Checkboxes */}
          <div className="mb-8">
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={isInspectionConfirmed}
                onChange={() =>
                  setIsInspectionConfirmed(!isInspectionConfirmed)
                }
                className="mr-2 w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-400 border-gray-300 rounded"
              />
              <span className="text-gray-700">
                I confirm the inspection details.
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isTermsAccepted}
                onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                className="mr-2 w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-400 border-gray-300 rounded"
              />
              <span className="text-gray-700">
                I agree to the Terms and Conditions.
              </span>
            </label>
          </div>

          {/* Confirm Booking Button */}
          <button
            onClick={handleConfirmBooking}
            disabled={!isTermsAccepted || !isInspectionConfirmed}
            className={`w-full py-3 px-4 text-white rounded-lg ${
              !isTermsAccepted || !isInspectionConfirmed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-700"
            }`}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </>
  );
};

export default NonPaymentInspectionBooking;
