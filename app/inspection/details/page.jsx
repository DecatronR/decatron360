"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { formatCurrency } from "@/utils/helpers/formatCurrency";
import { formatTime } from "@/utils/helpers/formatTime";
import { PaystackButton } from "react-paystack";
import { useAuth } from "@/context/AuthContext";
import { fetchPropertyData } from "@/utils/api/properties/fetchPropertyData";

const InspectionDetails = () => {
  const publicKey = process.env.PAYSTACK_PUBLIC_KEY;
  const { user, loading: userLoading } = useAuth();
  const name = user?.data?.name || "";
  const email = user?.data?.email || "";
  const phone = user?.data?.phone || "";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inspectionData, setInspectionData] = useState(null);
  const [isInspectionConfirmed, setIsInspectionConfirmed] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDate, setEditedDate] = useState("");
  const [editedTime, setEditedTime] = useState("");

  const id = searchParams.get("id");

  useEffect(() => {
    const handleFetchPropertyData = async () => {
      if (!id) return;

      try {
        const res = await fetchPropertyData(id);
        setProperty(res);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      handleFetchPropertyData();
    }
  }, [id]);

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
    email,
    amount: total,
    metadata: {
      name,
      phone,
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
  const isDataReady =
    !userLoading && !loading && property && inspectionData && user;

  if (!isDataReady) {
    return <p>Loading...</p>; // Show loading state until all data is ready
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Booking Summary</h1>

        <div className="mb-6">
          <h6 className="text-xl font-semibold mb-2">
            {property?.data.title || "Loading..."}
          </h6>
          <p className="text-gray-600">
            Location: {neighbourhood}, {lga}, {state}
          </p>
          <p className="text-gray-600">Inspection Date: {inspectionDate}</p>
          <p className="text-gray-600">Inspection Time: {inspectionTime}</p>
          {isEditing ? (
            <button onClick={handleSave} className="text-blue-500">
              Save
            </button>
          ) : (
            <button onClick={handleEdit} className="text-blue-500">
              Edit
            </button>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Price Breakdown</h2>
          <div className="flex justify-between mb-2">
            <span>Inspection Fee</span>
            <span className="font-bold">{formatCurrency(inspectionFee)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Service Charge</span>
            <span className="font-bold">{formatCurrency(serviceCharge)}</span>
          </div>
          <div className="border-t mt-4 pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span className="font-bold">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Confirmation Checkboxes */}
        <div className="mb-6">
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={isInspectionConfirmed}
              onChange={() => setIsInspectionConfirmed(!isInspectionConfirmed)}
              className="mr-2"
            />
            I confirm the details of the inspection.
          </label>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={isTermsAccepted}
              onChange={() => setIsTermsAccepted(!isTermsAccepted)}
              className="mr-2"
            />
            I accept the terms and conditions.
          </label>
        </div>

        {/* Payment Button */}
        <PaystackButton
          {...componentProps}
          disabled={!isDataReady || !isInspectionConfirmed || !isTermsAccepted}
        />
      </div>
    </div>
  );
};

export default InspectionDetails;
