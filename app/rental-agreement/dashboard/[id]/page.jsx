"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TemplateWrapper from "components/RentalAgreement/TemplateWrapper";
import { fetchUserData } from "utils/api/user/fetchUserData";
import { fetchPropertyData } from "utils/api/properties/fetchPropertyData";
import { fetchTemplateDetails } from "app/utils/eSignature/fetchTemplateDetails";
import { createDocumentFromTemplate } from "app/utils/eSignature/createDocument";
import { initiatePayment } from "app/utils/payment/initiailizePayment";
import { verifyPayment } from "app/utils/payment/verifyPayment";
import { generatePaymentReference } from "utils/helpers/generatePaymentReference";
import { numberToWords } from "utils/helpers/priceNumberToWords";
import { getStartDate } from "utils/helpers/getStartData";
import { getEndDate } from "utils/helpers/getEndData";

const Dashboard = () => {
  const { id } = useParams();
  const rentalAgreementTemplateId =
    process.env.NEXT_PUBLIC_ZOHO_SIGN_RENTAL_AGREEMENT_TEMPLATE_ID;
  const [currentStage, setCurrentStage] = useState(0);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [propertyData, setPropertyData] = useState();
  const [ownerId, setOwnerId] = useState(null);
  const [ownerData, setOwnerData] = useState();
  const [tenantData, setTenantData] = useState();
  const [isCreating, setIsCreating] = useState(false);
  const [documentCreated, setDocumentCreated] = useState(false);
  const [paymentReference, setPaymentReference] = useState();
  const [paymentStatus, setPaymentStatus] = useState();
  const startDate = getStartDate();
  const endDate = getEndDate(startDate);
  const addressParts = [
    propertyData?.data.houseNoStreet,
    propertyData?.data.neighbourhood,
    propertyData?.data.state,
  ].filter(Boolean);
  const address = addressParts.join(", ");

  const documentFields = {
    templates: {
      field_data: {
        field_text_data: {
          Address: address,
          "Price in words": propertyData?.price
            ? numberToWords(propertyData?.data.price)
            : "",
          "Price in figures": propertyData?.data.price,
          Duration: "1 Year",
          "Start Date": startDate,
          "End Date": endDate,
          "Late Payment Fee": "₦2,000",
        },
        field_boolean_data: {},
        field_date_data: {
          Date: "01 January 1970",
        },
        field_radio_data: {},
        field_checkboxgroup_data: {},
      },
      notes: "",
      actions: [
        {
          action_type: "SIGN", // Ensure Zoho understands the role
          recipient_name: ownerData?.name,
          recipient_email: ownerData?.email,
          action_id: "451236000000038041",
          signing_order: 1,
          role: "LandLord",
          verify_recipient: false,
          private_notes: "",
          // witnesses: [
          //   {
          //     action_id: "451236000000038139",
          //     signing_order: 3,
          //     role: "Landlord's witness",
          //     verify_recipient: false,
          //     private_notes: "",
          //     witness_specified: true,
          //   },
          // ],
        },
        {
          action_type: "SIGN",
          recipient_name: tenantData?.name,
          recipient_email: tenantData?.email,
          action_id: "451236000000038047",
          signing_order: 2,
          role: "Tenant",
          verify_recipient: false,
          private_notes: "",
          // witnesses: [
          //   {
          //     action_id: "451236000000038145",
          //     signing_order: 4,
          //     role: "Tenant's witness",
          //     verify_recipient: false,
          //     private_notes: "",
          //     witness_specified: true,
          //   },
          // ],
        },
      ],
    },
  };

  const toggleCommentBox = () => setShowCommentBox(!showCommentBox);

  const handleCommentChange = (event) => setComment(event.target.value);

  useEffect(() => {
    const handleFetchPropertyData = async () => {
      try {
        const res = await fetchPropertyData(id);
        setPropertyData(res);
        setOwnerId(res.data.userID);
        console.log("property data: ", res);
      } catch (error) {
        console.log("Failed to fetch property data: ", error);
      }
    };

    if (id) handleFetchPropertyData();
  }, [id]);

  useEffect(() => {
    const handleFetchOwnerData = async () => {
      try {
        if (!ownerId) return;
        const res = await fetchUserData(ownerId);
        setOwnerData(res);
        console.log("owner data: ", res);
      } catch (error) {
        console.log("Failed to fetch owner data: ", error);
      }
    };

    handleFetchOwnerData();
  }, [ownerId]);

  useEffect(() => {
    const handleFetchTenantData = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) return;
      try {
        const res = await fetchUserData(userId);
        console.log("Tenant data: ", res);
        setTenantData(res);
      } catch (error) {
        console.log("Failed to fetch user | tenant data:", error);
      }
    };

    handleFetchTenantData();
  }, []);

  //fetch template details with id

  useEffect(() => {
    const handleFetchTemplateDetails = async () => {
      console.log("Template id: ", rentalAgreementTemplateId);

      if (!rentalAgreementTemplateId) return;
      try {
        const res = await fetchTemplateDetails(rentalAgreementTemplateId);
        console.log("Templates details: ", res);
      } catch (error) {
        console.log("Failed to fetch template details by Id: ", error);
      }
    };
    handleFetchTemplateDetails();
  }, [rentalAgreementTemplateId]);

  //create a document with from the temaplete id

  const handleCreateDocument = async () => {
    if (!propertyData || !ownerData || !tenantData) {
      console.log("Missing required data to create document");
      return;
    }

    setIsCreating(true);
    // console.log("Document fields before creation: ", documentFields);
    console.log(
      "Payload before sending:",
      JSON.stringify(documentFields, null, 2)
    );

    try {
      const res = await createDocumentFromTemplate(
        rentalAgreementTemplateId,
        documentFields
      );
      console.log("New document created: ", res);
    } catch (error) {
      console.log("Failed to create document from template: ", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDocumentDispatch = () => {
    //function to send our document for signatures to be triggered immediately after payment is verified
  };

  //Trigger payment functionality
  const handlePayment = async () => {
    try {
      const paymentData = {
        amount: 5000,
        customerName: "John Doe",
        customerEmail: "johndoe@example.com",
        paymentReference: generatePaymentReference(rent),
        paymentDescription: "Real payment",
      };

      const response = await initiatePayment(paymentData);
      setPaymentReference(paymentData.paymentReference);
      console.log("Payment initiated:", response);

      // Redirect the user to the Monnify payment page if applicable
      if (response.responseBody.checkoutUrl) {
        window.location.href = response.responseBody.checkoutUrl;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  //poll for verification of payment
  useEffect(() => {
    if (!paymentReference) {
      alert("No payment reference found");
      return;
    }

    let attempts = 0;
    const maxAttempts = 12;

    const pollPaymentStatus = async () => {
      try {
        const response = await verifyPayment(paymentReference);
        console.log("Payment status:", response);

        if (response?.transaction?.status === "PAID") {
          clearInterval(interval); // Stop polling
          setPaymentStatus("verified");
          handleDocumentDispatch(); // Proceed to send out document for signing
        } else {
          setStatus("pending");
        }
      } catch (error) {
        console.error("Error verifying payment:", error.message);
        if (attempts >= maxAttempts) {
          clearInterval(interval); // Stop polling after max attempts
          setStatus("failed");
        }
      }
      attempts++;
    };

    const interval = setInterval(pollPaymentStatus, 5000); // Poll every 5 seconds
    pollPaymentStatus(); // Run once immediately

    return () => clearInterval(interval); // Cleanup when component unmounts
  }, [paymentReference]);

  //send the document for signing
  const handleSubmitComment = () => {
    if (comment.trim()) {
      setComments([...comments, { text: comment, timestamp: new Date() }]);
      setComment("");
    }
  };

  return (
    <div className="py-4 sm:p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="px-4 sm:px-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
          Rental Agreement Dashboard
        </h1>
      </header>

      <div className="bg-white shadow-md rounded-lg p-0 sm:p-6 relative flex flex-col transition-all duration-500">
        {/* Main Content - Template & Comment Box */}
        <div className="flex flex-col lg:flex-row gap-4 mt-0 sm:mt-6">
          <div
            className={`w-full lg:${
              showCommentBox ? "w-2/3" : "w-full"
            } min-h-[300px]`}
          >
            <TemplateWrapper
              propertyData={propertyData}
              ownerData={ownerData}
              tenantData={tenantData}
            />
          </div>

          {showCommentBox && (
            <div className="w-full lg:w-1/3 bg-gray-100 shadow-md rounded-md p-4 sm:p-6 flex flex-col max-h-[1000px]">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Modification Requests
              </h3>
              <div className="flex-1 overflow-y-auto max-h-[700px] space-y-2 border p-2 rounded-md bg-white">
                {comments.length > 0 ? (
                  comments.map((msg, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 p-2 rounded-md text-gray-700 text-sm"
                    >
                      <p>{msg.text}</p>
                      <span className="text-xs text-gray-500 block mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No messages yet.</p>
                )}
              </div>
              <textarea
                className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                rows={2}
                placeholder="Describe the required modifications..."
                value={comment}
                onChange={handleCommentChange}
              ></textarea>
              <button
                onClick={handleSubmitComment}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
              >
                Submit Request
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-6 py-4 sm:py-4">
          <button
            className="px-6 py-2 w-full sm:w-auto bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            onClick={handleCreateDocument}
          >
            Proceed to Sign
          </button>

          <button
            onClick={toggleCommentBox}
            className="px-6 py-2 w-full sm:w-auto bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition"
          >
            Request Modification
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
