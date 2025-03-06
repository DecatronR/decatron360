"use client";
import React, { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import RentalAgreementTemplate from "components/RentalAgreement/RentalAgreementTemplate";

const TemplateWrapper = () => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [padding, setPadding] = useState("20px");
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    // Check if running in the browser
    setIsBrowser(typeof window !== "undefined");
  }, []);

  useEffect(() => {
    const updatePadding = () => {
      setPadding(window.innerWidth < 768 ? "0px" : "20px");
    };

    updatePadding(); // Run on initial load
    window.addEventListener("resize", updatePadding);

    return () => window.removeEventListener("resize", updatePadding);
  }, []);

  useEffect(() => {
    const generatePdf = async () => {
      try {
        const blob = await pdf(<RentalAgreementTemplate />).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    };

    generatePdf();

    return () => {
      // Cleanup the object URL to prevent memory leaks
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f7fa", // Soft background color
        padding,
      }}
    >
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#fff", // White background for the PDF section
          borderRadius: "8px", // Rounded corners for smooth look
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Light shadow for depth
          padding: "20px",
          maxWidth: "100%",
          width: "800px", // Limit width to prevent stretching
        }}
      >
        {/* Display PDF in an iframe only in the browser */}
        {/* {isBrowser && pdfUrl ? (
          <iframe
            src={pdfUrl}
            width="100%"
            height="700px"
            style={{
              border: "none",
              borderRadius: "8px",
            }}
          />
        ) : (
          <p>Generating Rental Agreement...</p>
        )} */}

        {isBrowser && pdfUrl ? (
          <object
            data={pdfUrl}
            type="application/pdf"
            width="100%"
            height="700px"
            style={{ border: "none", borderRadius: "8px" }}
          >
            <p>
              Your browser does not support PDFs.{" "}
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                Download it instead
              </a>
            </p>
          </object>
        ) : (
          <p>Generating Rental Agreement...</p>
        )}
      </div>
    </div>
  );
};

export default TemplateWrapper;
