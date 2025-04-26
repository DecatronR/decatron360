"use client";
import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import RentalAgreementTemplate from "components/RentalAgreement/RentalAgreementTemplate";

const RentalAgreementWrapper = ({
  propertyData,
  ownerData,
  tenantData,
  isFullScreen,
  toggleFullScreen,
}) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [padding, setPadding] = useState("20px");

  useEffect(() => {
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
        height: isFullScreen ? "100vh" : "100vh",
        backgroundColor: isFullScreen ? "#fff" : "#f4f7fa",
        padding: isFullScreen ? "0px" : padding,
        overflow: isFullScreen ? "hidden" : "auto",
      }}
    >
      {isFullScreen && (
        <button
          onClick={toggleFullScreen}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 10000,
            padding: "10px 16px",
            backgroundColor: " #5a47fb",
            color: "#fff",
            border: "none",
            borderRadius: "7px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
          }}
        >
          Exit Fullscreen
        </button>
      )}
      <div
        style={{
          position: isFullScreen ? "fixed" : "relative",
          top: isFullScreen ? 0 : "auto",
          left: isFullScreen ? 0 : "auto",
          width: isFullScreen ? "100vw" : "800px",
          height: isFullScreen ? "100vh" : "auto",
          zIndex: isFullScreen ? 9999 : "auto",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: isFullScreen ? "0" : "8px",
          boxShadow: isFullScreen ? "none" : "0 4px 8px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Fullscreen toggle button is now handled in ContractDetailsContent, so no need here */}

        {/* PDF Viewer */}
        {isBrowser && (
          <div
            style={{
              marginTop: "50px",
              height: isFullScreen ? "calc(100vh - 70px)" : "700px",
            }}
          >
            <PDFViewer
              width="100%"
              height="100%"
              style={{
                border: "none",
                borderRadius: isFullScreen ? "0" : "8px",
              }}
            >
              {propertyData && ownerData && tenantData && (
                <RentalAgreementTemplate
                  ownerName={ownerData.name}
                  tenantName={tenantData.name}
                  propertyNeighbourhood={propertyData.data.neighbourhood}
                  propertyState={propertyData.data.state}
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
