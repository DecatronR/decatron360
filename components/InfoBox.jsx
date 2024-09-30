"use client";
import { useEffect, useState } from "react";

const InfoBox = ({
  heading,
  backgroundColor,
  children,
  buttonInfo,
  textColor,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={`${backgroundColor} rounded-lg p-4`}>
      <h3 className="text-lg font-semibold">{heading}</h3>
      <p className={`${textColor} mt-2 mb-4`}>{children}</p>
      {isMounted && buttonInfo && buttonInfo.link && (
        <a
          href={buttonInfo.link}
          className={`inline-block ${buttonInfo.backgroundColor} text-white rounded-lg px-4 py-2 hover:opacity-80`}
        >
          {buttonInfo.text}
        </a>
      )}
    </div>
  );
};

export default InfoBox;
