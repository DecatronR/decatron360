"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const KycButton = () => {
  const testClientId = process.env.NEXT_PUBLIC_QOREID_TEST_CLIENT_ID;
  const workFlowId = process.env.NEXT_PUBLIC_QOREID_WORK_FLOW_ID;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (window.QoreID) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div>
      <Script
        src="https://dashboard.qoreid.com/qoreid-sdk/qoreid.js"
        strategy="afterInteractive"
        onLoad={() => setIsLoaded(true)}
      />

      {isLoaded && (
        <qoreid-button
          id="QoreIDButton"
          clientId={testClientId}
          customerReference={""}
          applicantData={"JSON.stringify(userData)"}
          flowId={workFlowId}
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
      )}
    </div>
  );
};

export default KycButton;
