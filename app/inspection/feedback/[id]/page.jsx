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
        setInspectionData(res);
      } catch (error) {
        console.log("Failed to fetch inspection data");
      }
    };
    handleFetchInspectionData();
  }, [id]);

  return <InspectionFeedbackForm inspectionData={inspectionData} />;
};

export default InspectionFeedbackPage;
