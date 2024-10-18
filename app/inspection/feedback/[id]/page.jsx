"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import InspectionFeedbackForm from "@/components/Inspection/InspectionFeedbackForm";
import { fetchBookingData } from "utils/api/inspection/fetchBookingData";

const InspectionFeedbackPage = () => {
  const { id } = useParams();
  const [inspectionData, setInspectionData] = useState({});

  useEffect(() => {
    if (!id) return;
    const handleFetchInspectionData = async () => {
      try {
        const res = await fetchBookingData(id);
        console.log("Inspection data: ", res);
        setInspectionData(res);
      } catch (error) {
        console.log("Failed to fetch inspection data");
      }
    };
    handleFetchInspectionData();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Inspection Feedback
      </h1>
      <InspectionFeedbackForm inspectionData={inspectionData} />
    </div>
  );
};

export default InspectionFeedbackPage;
