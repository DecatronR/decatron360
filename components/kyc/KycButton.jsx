"use client";

import { useEffect, useState } from "react";

const KycButton = () => {
  const testClientId = process.env.NEXT_PUBLIC_QOREID_TEST_CLIENT_ID;
  const workFlowId = process.env.NEXT_PUBLIC_QOREID_WORK_FLOW_ID;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Load the script dynamically
    const script = document.createElement("script");
    script.src = "https://dashboard.qoreid.com/qoreid-sdk/qoreid.js";
    script.async = true;
    script.onload = () => {
      console.log("QoreID script loaded");
      setIsLoaded(true);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      {isLoaded ? (
        <qoreid-button
          id="QoreIDButton"
          clientId={testClientId}
          flowId={workFlowId}
          customerReference="some-customer-ref"
          applicantData='{"firstname": "John", "lastname": "Doe", "phone": "08080808080", "email": "john@nomail.com"}'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            backgroundColor: isHovered ? "#3019b8" : "#432cde",
            color: "white",
            padding: "8px 16px",
            borderRadius: "20px",
            cursor: "pointer",
            transition: "background-color 0.3s ease-in-out",
            display: "inline-block",
            fontSize: "15.5px",
            fontWeight: "400",
            textAlign: "center",
          }}
        >
          Verify Identity
        </qoreid-button>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default KycButton;
