"use client";
import { useEffect } from "react";
import Script from "next/script";

const QoreIDLoader = () => {
  useEffect(() => {
    const checkQoreID = () => {
      if (window.QoreID) {
        console.log("QoreID script loaded");
        window.dispatchEvent(new Event("qoreid-loaded"));
      }
    };

    window.addEventListener("qoreid-loaded", checkQoreID);

    return () => {
      window.removeEventListener("qoreid-loaded", checkQoreID);
    };
  }, []);

  return (
    <Script
      src="https://dashboard.qoreid.com/qoreid-sdk/qoreid.js"
      strategy="beforeInteractive"
      onLoad={() => {
        console.log("QoreID script loaded");
        window.dispatchEvent(new Event("qoreid-loaded"));
      }}
    />
  );
};

export default QoreIDLoader;
