"use client";
import InspectionFeedbackForm from "@/components/Inspection/InspectionFeedbackForm";

const InspectionFeedbackPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Inspection Feedback
      </h1>
      <InspectionFeedbackForm />
    </div>
  );
};

export default InspectionFeedbackPage;
