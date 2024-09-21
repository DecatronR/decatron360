"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatTime } from "@/utils/formatTime";

const InspectionDetails = () => {
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
    const fetchPropertyData = async () => {
      if (!id) return;

      try {
        const response = await axios.post(
          "http://localhost:8080/propertyListing/editPropertyListing",
          { id },
          { withCredentials: true }
        );
        setProperty(response.data);
        console.log("response: ", response);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyData();
    }
  }, [id]);

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("inspectionData"));
    console.log("Fetched inspection data:", data);
    if (data) {
      setInspectionData(data);
    }
  }, []);

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

  const handleConfirmPayment = () => {
    if (isInspectionConfirmed && isTermsAccepted) {
      // Redirect to payment gateway
      window.location.href = "https://your-payment-gateway-url.com";
    } else {
      alert(
        "Please confirm the inspection details and accept the terms and conditions."
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Booking Summary</h1>
        <div className="mb-6">
          <h6 className="text-xl font-semibold mb-2">
            {property?.data.title || "Loading..."}
          </h6>
          <p className="text-gray-600">
            Location: {property?.data.neighbourhood}, {property?.data.lga},{" "}
            {property?.data.state}
          </p>
          <p className="text-gray-600">
            Inspection Date: {inspectionDetails.inspectionDate}
          </p>
          <p className="text-gray-600">
            Inspection Time: {inspectionDetails.inspectionTime}
          </p>
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

        {/* Confirm Button */}
        <button
          className="bg-primary-500 text-white rounded px-4 py-2 w-full"
          onClick={handleConfirmPayment}
        >
          Confirm and Pay
        </button>
      </div>
    </div>
  );
};

export default InspectionDetails;
