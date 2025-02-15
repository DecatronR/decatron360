import { useEffect } from "react";

const KycButton = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://dashboard.qoreid.com/qoreid-sdk/qoreid.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
            <qoreid-button
                   id="QoreIDButton"
                   clientId=""
                   productCode="liveness"
                   customerReference="fsdfsdf"
                   applicantData='{"firstname": "John", "lastname": "Doe", "phone":    "08080808080", "email": "jon@nomail.com"}'
                 ></qoreid-button>
                 `,
      }}
    />
  );
};
