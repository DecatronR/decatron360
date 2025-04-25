"use client";
import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import RentalAgreementTemplate from "components/RentalAgreement/RentalAgreementTemplate";

const RentalAgreementWrapper = ({ propertyData, ownerData, tenantData }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [padding, setPadding] = useState("20px");

  useEffect(() => {
    // Check if the code is running in the browser
    setIsBrowser(typeof window !== "undefined");
  }, []);

  useEffect(() => {
    const updatePadding = () => {
      setPadding(window.innerWidth < 768 ? "0px" : "20px");
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);

    return () => window.removeEventListener("resize", updatePadding);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f7fa", // Soft background color
        padding: padding,
      }}
    >
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          maxWidth: "100%",
          width: "800px",
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
              {propertyData && ownerData && tenantData && (
                <RentalAgreementTemplate
                  ownerName={ownerData.name}
                  tenantName={tenantData.name}
                  // propertyHouseNumberAndStreet={propertyData.data.houseNoStreet}
                  propertyNeighbourhood={propertyData.data.neighbourhood}
                  propertyState={propertyData.data.state}
                  // rentDuration={propertyData.data.duration}
                  rentPrice={propertyData.data.price}
                  cautionFee={propertyData.data.cautionFee}
                  agencyFee={propertyData.data.agencyFee}
                  latePaymentFee={propertyData.data.latePaymentFee}
                />
              )}
            </PDFViewer>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalAgreementWrapper;
