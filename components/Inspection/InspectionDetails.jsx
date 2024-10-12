"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Spinner from "@/components/Spinner";
import { formatCurrency } from "@/utils/helpers/formatCurrency";
import { formatTime } from "@/utils/helpers/formatTime";
import { PaystackButton } from "react-paystack";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import { fetchPropertyData } from "@/utils/api/properties/fetchPropertyData";

const InspectionDetails = () => {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inspectionData, setInspectionData] = useState(null);
  const [isInspectionConfirmed, setIsInspectionConfirmed] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDate, setEditedDate] = useState("");
  const [editedTime, setEditedTime] = useState("");

  const propertyId = searchParams.get("id");
  let userId;

  useEffect(() => {
    const handleFetchUserData = async () => {
      userId = sessionStorage.getItem("userId");
      if (!userId) {
        console.log("Please make sure you are logged in first: ");
        return;
      }

      try {
        const res = await fetchUserData(userId);
        console.log("user data in payment page: ", res);
        setUser(res);
      } catch (error) {
        console.log("Issue with fetching user data: ", error);
      }
    };
    handleFetchUserData();
  }, []);

  useEffect(() => {
    const handleFetchPropertyData = async () => {
      if (!propertyId) return;

      try {
        const res = await fetchPropertyData(propertyId);
        setProperty(res);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      handleFetchPropertyData();
    }
  }, [propertyId]);

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("inspectionData"));
    if (data) {
      setInspectionData(data);
      setEditedDate(data.date);
      setEditedTime(data.time);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedData = {
      ...inspectionData,
      date: editedDate,
      time: editedTime,
    };
    setInspectionData(updatedData);
    sessionStorage.setItem("inspectionData", JSON.stringify(updatedData));
    setIsEditing(false);
  };

  const inspectionDetails = {
    inspectionDate: isEditing ? (
      <input
        type="date"
        value={editedDate}
        onChange={(e) => setEditedDate(e.target.value)}
        className="border rounded-md p-2 w-full"
      />
    ) : inspectionData ? (
      inspectionData.date
    ) : (
      "Loading..."
    ),
    inspectionTime: isEditing ? (
      <input
        type="time"
        value={editedTime}
        onChange={(e) => setEditedTime(e.target.value)}
        className="border rounded-md p-2 w-full"
      />
    ) : inspectionData ? (
      formatTime(inspectionData.time)
    ) : (
      "Loading..."
    ),
    inspectionFee: 10000,
    serviceCharge: 1500,
    propertyTitle: property ? property.data.title : "Loading...",
    state: property ? property.data.state : "Loading...",
    lga: property ? property.data.lga : "",
    neighbourhood: property ? property.data.neighbourhood : "",
  };

  const {
    inspectionDate,
    inspectionTime,
    inspectionFee,
    serviceCharge,
    propertyTitle,
    state,
    lga,
    neighbourhood,
  } = inspectionDetails;

  // Calculate total
  const total = inspectionFee + serviceCharge;

  const componentProps = {
    email: user?.email,
    amount: total * 100,
    metadata: {
      name: user?.name,
      phone: user?.phone,
    },
    publicKey,
    text: "Confirm and Pay",
    onSuccess: () =>
      alert("Thanks, your inspection has been successfully booked!!"),
    onClose: () =>
      alert("You cancelled your inspection booking, is there an issue?"),
  };

  console.log("Payment props: ", componentProps);

  // Make sure all data is loaded before rendering
  const isDataReady = !isLoading && property && inspectionData && user;

  if (!isDataReady) {
    return <Spinner />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Booking Summary</h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{propertyTitle}</h2>
          <p className="text-gray-700 mb-2">
            Location: {neighbourhood}, {lga}, {state}
          </p>
          <div className="text-gray-700">
            <p>Inspection Date: {inspectionDate}</p>
            <p>Inspection Time: {inspectionTime}</p>
          </div>
          {isEditing ? (
            <button onClick={handleSave} className="mt-2 text-blue-600">
              Save Changes
            </button>
          ) : (
            <button onClick={handleEdit} className="mt-2 text-blue-600">
              Edit
            </button>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Price Breakdown</h2>
          <div className="flex justify-between mb-3">
            <span className="text-gray-600">Inspection Fee</span>
            <span className="font-bold">{formatCurrency(inspectionFee)}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-gray-600">Service Charge</span>
            <span className="font-bold">{formatCurrency(serviceCharge)}</span>
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Confirmation Checkboxes */}
        <div className="mb-8">
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={isInspectionConfirmed}
              onChange={() => setIsInspectionConfirmed(!isInspectionConfirmed)}
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
              I accept the terms and conditions.
            </span>
          </label>
        </div>

        {/* Payment Button */}
        <div className="flex justify-center">
          <PaystackButton
            {...componentProps}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            disabled={
              !isDataReady || !isInspectionConfirmed || !isTermsAccepted
            }
          />
        </div>
      </div>
    </div>
  );
};

export default InspectionDetails;
