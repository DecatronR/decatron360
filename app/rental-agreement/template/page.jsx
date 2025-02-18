"use client";
import React, { useEffect, useState } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import RentalAgreementTemplate from "components/RentalAgreement/RentalAgreementTemplate";

const PdfRenderer = () => {
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

        {/* Option 2: Provide a download link */}
        <div style={{ marginTop: "20px" }}>
          <PDFDownloadLink
            document={<RentalAgreementTemplate />}
            fileName="RentalAgreement.pdf"
          >
            {({ loading }) => (
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#5a47fb", // Matching primary color
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#432cde")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#5a47fb")}
              >
                {loading ? "Loading document..." : "Download Rental Agreement"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
