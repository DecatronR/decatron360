"use client"; // Required for interactive components

import Script from "next/script";
import { useEffect, useState } from "react";

const KycButton = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.QoreID) {
      setIsLoaded(true); // Ensure script is already available
    }
  }, []);

  return (
    <div>
      {/* ✅ Load QoreID SDK only when needed */}
      <Script
        src="https://dashboard.qoreid.com/qoreid-sdk/qoreid.js"
        strategy="afterInteractive" // Loads after page render
        onLoad={() => setIsLoaded(true)} // Update state when loaded
      />

      {/* ✅ Render only after SDK is loaded */}
      {isLoaded && (
        <qoreid-button
          id="QoreIDButton"
          clientId="YOUR_QOREID_CLIENT_ID"
          customerReference="fsdfsdf"
          applicantData='{"firstname": "John", "lastname": "Doe", "phone": "08080808080", "email": "jon@nomail.com"}'
        ></qoreid-button>
      )}
    </div>
  );
};

export default KycButton;
