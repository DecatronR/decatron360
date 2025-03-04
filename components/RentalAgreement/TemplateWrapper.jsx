"use client";
import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import RentalAgreementTemplate from "components/RentalAgreement/RentalAgreementTemplate";

const TemplateWrapper = () => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    // Check if the code is running in the browser
    setIsBrowser(typeof window !== "undefined");
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f7fa", // Soft background color
        padding: "20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#fff", // White background for the PDF section
          borderRadius: "8px", // Rounded corners for smooth look
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Light shadow for depth
          padding: "20px",
          maxWidth: "90%",
          width: "800px", // Limit width to prevent stretching
        }}
      >
        {/* Option 1: Display PDF in a viewer only in the browser */}
        {isBrowser && (
          <div
            style={{
              marginBottom: "20px", // Space below the PDF viewer
            }}
          >
            <PDFViewer
              width="100%"
              height="700px"
              style={{
                border: "none", // Remove the border
                borderRadius: "8px", // Smooth edges for the viewer
              }}
            >
              <RentalAgreementTemplate />
            </PDFViewer>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateWrapper;
