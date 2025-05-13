"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Wallet, CalendarDays, MessageSquare, X } from "lucide-react";
import { fetchContractById } from "utils/api/contract/fetchContractById";
import { truncateText } from "utils/helpers/truncateText";
import OwnerModificationChat from "components/RentalAgreement/Chat/OwnerModificationChat";
import ClientModificationChat from "components/RentalAgreement/Chat/ClientModificationChat";
import { fetchUserData } from "utils/api/user/fetchUserData";
import { fetchPropertyData } from "utils/api/properties/fetchPropertyData";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Pencil, Maximize2, ArrowLeft, FileText } from "lucide-react";
import EditAgreementDialog from "./EditAgreementDialogue";
import { useAuth } from "context/AuthContext";
import { updateAgreement } from "utils/api/contract/updateAgreement";
import { fetchTemplateDetails } from "app/utils/eSignature/fetchTemplateDetails";
import { getDocumentFields } from "./getDocumentFields";
import { numberToWords } from "utils/helpers/priceNumberToWords";
import { getStartDate } from "utils/helpers/getStartDate";
import { getEndDate } from "utils/helpers/getEndDate";
import { formatDateWithOrdinal } from "utils/helpers/formatDateWithOrdinal";
import { createDocumentFromTemplate } from "app/utils/eSignature/createDocument";
import ContractActions from "./ContractActions";
import SignatureStatus from "./SignatureStatus";
import PropertyDetails from "./PropertyDetails";
import { fetchSignatureByContractId } from "utils/api/eSignature/fetchSignatureByContractId";
import SignatureDisplay from "./SignatureDisplay";
import Swal from "sweetalert2";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import RentalAgreementTemplate from "components/RentalAgreement/RentalAgreementTemplate";
import ReactDOM from "react-dom/client";

const ContractDashboard = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const rentalAgreementTemplateId =
    process.env.NEXT_PUBLIC_ZOHO_SIGN_RENTAL_AGREEMENT_TEMPLATE_ID;
  const [userRole, setUserRole] = useState();
  const [contract, setContract] = useState(null);
  const [leftWidth, setLeftWidth] = useState(70); // Default 70% for the left section
  const [isDragging, setIsDragging] = useState(false);
  const [propertyData, setPropertyData] = useState();
  const [ownerData, setOwnerData] = useState();
  const [tenantData, setTenantData] = useState();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [signedRoles, setSignedRoles] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [rentAndDurationText, setRentAndDurationText] = useState([
    "Loading tenancy details...",
    "Loading caution fee details...",
    "Loading agency fee details...",
  ]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [tenantObligations, setTenantObligations] = useState([
    "Pay all applicable utility and security charges promptly.",
    "Maintain cleanliness and good condition of the premises.",
    "Use the property solely for residential purposes.",
    "Obtain written consent before sub-letting or making alterations.",
    "Repair any damages caused by themselves or their visitors.",
    "Vacate upon expiry unless renewed by agreement.",
    "Pay NGN1,000 as mesne profit for each day of illegal occupation after expiry.",
    "Notify the Landlord at least 30 days before expiration if intending to renew.",
  ]);

  const [landlordObligations, setLandlordObligations] = useState([
    "Ensure peaceful possession by the Tenant upon timely payment.",
    "Not unreasonably withhold required consents.",
    "Provide one month's notice before expiration for possession delivery.",
  ]);

  const agreementData = {
    "Rent and Duration": rentAndDurationText,
    "Tenant's Obligation": tenantObligations,
    "Landlord's Obligation": landlordObligations,
  };

  const handleSignatureSave = (signatureDataUrlOrFileUrl) => {
    console.log("Saved signature:", signatureDataUrlOrFileUrl);
  };
  useEffect(() => {
    const handleFetchContractDetails = async () => {
      try {
        const res = await fetchContractById(id);
        console.log("Contract details: ", res);

        const fetchedAgreement = res.data.agreement;
        console.log("Fetch agreement: ", fetchedAgreement);

        // If the agreement is empty, fall back on the hardcoded data
        const agreement = {
          "Rent and Duration": fetchedAgreement.rentAndDuration.length
            ? fetchedAgreement.rentAndDuration
            : rentAndDurationText,
          "Tenant's Obligation": fetchedAgreement.tenantObligations.length
            ? fetchedAgreement.tenantObligations
            : tenantObligations,
          "Landlord's Obligation": fetchedAgreement.landlordObligations.length
            ? fetchedAgreement.landlordObligations
            : landlordObligations,
        };

        // Set agreement data into the state
        setRentAndDurationText(agreement["Rent and Duration"]);
        setTenantObligations(agreement["Tenant's Obligation"]);
        setLandlordObligations(agreement["Landlord's Obligation"]);

        // Optionally set contract details if needed
        setContract(res.data);
      } catch (error) {
        console.error("Failed to fetch contract details: ", error);

        // In case of error, fall back to the hardcoded data directly
        const agreement = {
          "Rent and Duration": rentAndDurationText,
          "Tenant's Obligation": tenantObligations,
          "Landlord's Obligation": landlordObligations,
        };

        setRentAndDurationText(agreement["Rent and Duration"]);
        setTenantObligations(agreement["Tenant's Obligation"]);
        setLandlordObligations(agreement["Landlord's Obligation"]);
      }
    };

    handleFetchContractDetails();
  }, [id]);

  useEffect(() => {
    const handleFetchPropertyData = async () => {
      try {
        const res = await fetchPropertyData(contract.propertyId);
        setPropertyData(res);
        console.log("property data: ", res);
      } catch (error) {
        console.log("Failed to fetch property data: ", error);
      }
    };

    handleFetchPropertyData();
  }, [contract]);

  useEffect(() => {
    if (propertyData && propertyData.data) {
      // Function to clean unwanted characters like '¦'
      const cleanValue = (value) => {
        return value ? value.replace(/[^0-9.,]/g, "") : "N/A"; // Removes any non-numeric, non-comma, non-period characters
      };

      setRentAndDurationText([
        `The tenancy is for a fixed term of , commencing from one week after the signing of this agreement and ending 365 days thereafter. The rent of NGN${cleanValue(
          propertyData.data.price
        )} is payable in advance`,

        `A refundable caution fee of NGN${cleanValue(
          propertyData.data.cautionFee
        )} is payable and shall be refunded at the end of the tenancy period, subject to property inspection`,

        `An agency/transaction fee of 15% of the rent price applies for administrative and processing costs.`,
      ]);
    }
  }, [propertyData]);

  useEffect(() => {
    const handleFetchUserRole = async () => {
      const userId = sessionStorage.getItem("userId");
      try {
        const res = await fetchUserData(userId);
        setUserRole(res.role);
      } catch (error) {
        console.log("Failed to get user role: ", error);
      }
    };
    handleFetchUserRole();
  }, []);

  // Function to fetch signatures
  const fetchSignedRolesData = useCallback(async () => {
    try {
      const signatureRes = await fetchSignatureByContractId(id);
      if (signatureRes.responseCode === 200) {
        const signatureEvents = signatureRes.data;

        // Extract unique roles from signature events
        const roles = [...new Set(signatureEvents.map((event) => event.role))];
        setSignedRoles(roles);

        // Map signature events to the format needed for the PDF
        const formattedSignatures = roles.map((role) => {
          const event = signatureEvents.find((event) => event.role === role);
          if (event) {
            return {
              role,
              signerName: event.user?.name || "Unknown",
              timestamp: event.timestamp,
              signature: event.signature,
              witness: event.witness
                ? {
                    name: event.witness.name,
                    email: event.witness.email,
                    signature: event.witness.signature,
                    timestamp: event.witness.timestamp,
                  }
                : null,
            };
          }
          return {
            role,
            signerName: "Not signed",
            timestamp: null,
            signature: null,
            witness: null,
          };
        });

        setSignatures(formattedSignatures);
      }
    } catch (error) {
      console.error("Error fetching signatures:", error);
    }
  }, [id]);

  // Initial fetch and polling setup
  useEffect(() => {
    // Initial fetch
    fetchSignedRolesData();

    // Set up polling
    const pollInterval = setInterval(() => {
      fetchSignedRolesData();
    }, 5000); // Check every 5 seconds

    // Cleanup on unmount
    return () => clearInterval(pollInterval);
  }, [fetchSignedRolesData]);

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newWidth = (e.clientX / window.innerWidth) * 100;
      setLeftWidth(Math.min(Math.max(newWidth, 20), 80)); // Constrain between 20% and 80%
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleFetchOwnerData = async () => {
      try {
        const res = await fetchUserData(contract.ownerId);
        setOwnerData(res);
        console.log("owner data: ", res);
      } catch (error) {
        console.log("Failed to fetch owner data: ", error);
      }
    };

    handleFetchOwnerData();
  }, [contract]);

  useEffect(() => {
    const handleFetchClientData = async () => {
      try {
        const res = await fetchUserData(contract.clientId);
        console.log("Tenant data: ", res);
        setTenantData(res);
      } catch (error) {
        console.log("Failed to fetch client data:", error);
      }
    };

    handleFetchClientData();
  }, [contract]);

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

  const handleAgreementUpdate = async (updatedValue) => {
    try {
      // Get the latest state values
      const agreement = {
        rentAndDuration: rentAndDurationText,
        tenantObligations: tenantObligations,
        landlordObligations: landlordObligations,
      };

      // Update the local state first
      if (updatedValue) {
        if (Array.isArray(updatedValue)) {
          if (updatedValue[0]?.includes("tenancy is for")) {
            setRentAndDurationText(updatedValue);
          } else if (updatedValue[0]?.includes("Pay all applicable")) {
            setTenantObligations(updatedValue);
          } else if (updatedValue[0]?.includes("Ensure peaceful")) {
            setLandlordObligations(updatedValue);
          }
        }
      }

      console.log("Updating agreement with:", agreement);

      const res = await updateAgreement(id, agreement);

      if (res.responseCode === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Agreement updated successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error(res.message || "Failed to update agreement");
      }
    } catch (error) {
      console.error("Failed to update agreement:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update agreement. Please try again.",
      });
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleSign = () => {};

  const handleCreateDocument = async () => {
    if (!propertyData || !ownerData || !tenantData) {
      console.log("Missing required data to create document");
      return;
    }
    const address = `${propertyData.data.houseNoStreet || ""}, ${
      propertyData.data.neighbourhood || ""
    }, ${propertyData.data.propertyState || ""}, ${
      propertyData.data.state || ""
    }`;
    const priceInWords = numberToWords(propertyData.data.price);
    const startDate = getStartDate();
    const endDate = getEndDate(startDate);
    const agreementDate = formatDateWithOrdinal().toString();

    const documentData = {
      address: address,
      priceInFigures: propertyData.data.price,
      priceInWords: priceInWords,
      startDate: startDate,
      endDate: endDate,
      duration: "One Year",
      latePaymentFee: propertyData.data.latePaymentFee,
      date: agreementDate,
      landlordName: ownerData.name,
      landlordEmail: ownerData.email,
      tenantName: tenantData.name,
      tenantEmail: tenantData.email,
    };

    console.log("Data: ", documentData);

    const documentFields = getDocumentFields(documentData);

    setIsCreating(true);
    console.log("Document fields before creation: ", documentFields);
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

  if (!contract || !propertyData || !propertyData.data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading contract details...</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden px-2 md:px-6 py-2 md:py-4 mt-4 md:mt-0"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Left Section - Contract Details */}
      <div
        className={`transition-all duration-200 ease-in-out overflow-auto max-w-screen-lg mx-auto 
        w-full md:w-auto md:flex-1 mb-4 md:mb-0 pb-4 md:pb-0`}
        style={{ width: window.innerWidth >= 768 ? `${leftWidth}%` : "100%" }}
      >
        <button
          onClick={() => router.back()}
          className="hidden md:flex items-center text-sm text-blue-600 mb-4 hover:underline"
        >
          <ArrowLeft className="mr-2" /> Back
        </button>

        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 px-2 md:px-0">
          Contract:{" "}
          {truncateText(
            contract.propertyName,
            window.innerWidth < 768 ? 25 : 40
          )}
        </h1>

        {/* Signature Status Section */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border mb-4 md:mb-6 mx-2 md:mx-0">
          <SignatureStatus contractId={contract._id} />
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border mb-4 md:mb-6 mx-2 md:mx-0">
          <PropertyDetails contract={contract} />
        </div>

        {/* Tenancy Agreement Template */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border mb-4 md:mb-6 mx-2 md:mx-0 min-h-[400px]">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-lg md:text-xl font-bold">
              Tenancy Agreement Terms
            </h3>
            <div className="flex items-center space-x-2 md:space-x-4">
              {contract?.ownerId === user?.id && (
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        onClick={() =>
                          signedRoles.length === 0 && setIsEditDialogOpen(true)
                        }
                        className={`p-1 md:p-2 rounded-full ${
                          signedRoles.length > 0
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }`}
                        disabled={signedRoles.length > 0}
                      >
                        <Pencil className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="bottom"
                      sideOffset={4}
                      className="bg-gray-800 text-white text-xs rounded px-2 py-1 hidden md:block"
                      style={{ zIndex: 9999 }}
                    >
                      {signedRoles.length > 0
                        ? "Cannot edit after signatures have been added. Please create a new contract if changes are needed."
                        : "Edit Agreement"}
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              )}
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={() => {
                        if (!propertyData || !ownerData || !tenantData) {
                          Swal.fire({
                            icon: "error",
                            title: "Missing Data",
                            text: "Please wait while we load all the required data.",
                          });
                          return;
                        }

                        Swal.fire({
                          title: "Tenancy Agreement Preview",
                          html: `
                            <div style="height: 80vh; width: 100%;">
                              <div id="pdf-preview" style="height: 100%; width: 100%;"></div>
                            </div>
                          `,
                          width: "80%",
                          showConfirmButton: true,
                          showCancelButton: true,
                          confirmButtonText: "Download PDF",
                          cancelButtonText: "Close",
                          didOpen: () => {
                            const pdfPreview =
                              document.getElementById("pdf-preview");
                            const pdfViewer = document.createElement("div");
                            pdfViewer.style.height = "100%";
                            pdfViewer.style.width = "100%";
                            pdfPreview.appendChild(pdfViewer);

                            const root = ReactDOM.createRoot(pdfViewer);
                            root.render(
                              <PDFViewer width="100%" height="100%">
                                <RentalAgreementTemplate
                                  ownerName={ownerData.name}
                                  tenantName={tenantData.name}
                                  propertyNeighbourhood={
                                    propertyData.data.neighbourhood
                                  }
                                  propertyState={propertyData.data.state}
                                  rentPrice={propertyData.data.price}
                                  cautionFee={propertyData.data.cautionFee}
                                  agencyFee={propertyData.data.agencyFee}
                                  latePaymentFee={
                                    propertyData.data.latePaymentFee
                                  }
                                  rentAndDurationText={rentAndDurationText}
                                  tenantObligations={tenantObligations}
                                  landlordObligations={landlordObligations}
                                />
                              </PDFViewer>
                            );
                          },
                          willClose: () => {
                            const pdfPreview =
                              document.getElementById("pdf-preview");
                            if (pdfPreview) {
                              pdfPreview.innerHTML = "";
                            }
                          },
                        }).then((result) => {
                          if (result.isConfirmed) {
                            // Create a hidden PDFDownloadLink
                            const downloadContainer =
                              document.createElement("div");
                            downloadContainer.style.display = "none";
                            document.body.appendChild(downloadContainer);

                            const root = ReactDOM.createRoot(downloadContainer);
                            root.render(
                              <PDFDownloadLink
                                document={
                                  <RentalAgreementTemplate
                                    ownerName={ownerData.name}
                                    tenantName={tenantData.name}
                                    propertyNeighbourhood={
                                      propertyData.data.neighbourhood
                                    }
                                    propertyState={propertyData.data.state}
                                    rentPrice={propertyData.data.price}
                                    cautionFee={propertyData.data.cautionFee}
                                    agencyFee={propertyData.data.agencyFee}
                                    latePaymentFee={
                                      propertyData.data.latePaymentFee
                                    }
                                    rentAndDurationText={rentAndDurationText}
                                    tenantObligations={tenantObligations}
                                    landlordObligations={landlordObligations}
                                    signatures={signatures.map((sig) => ({
                                      role: sig.role
                                        .replace(/([A-Z])/g, " $1")
                                        .trim(),
                                      signerName: sig.signerName,
                                      timestamp: sig.timestamp,
                                      signature: sig.signature,
                                      witness: sig.witness
                                        ? {
                                            name: sig.witness.name,
                                            email: sig.witness.email,
                                            signature: sig.witness.signature,
                                            timestamp: sig.witness.timestamp,
                                          }
                                        : null,
                                    }))}
                                  />
                                }
                                fileName={`tenancy-agreement-${id}.pdf`}
                              >
                                {({ url, loading }) => {
                                  if (loading) {
                                    return null;
                                  }
                                  // Create and click a temporary link
                                  const link = document.createElement("a");
                                  link.href = url;
                                  link.click();
                                  // Clean up after a short delay
                                  setTimeout(() => {
                                    document.body.removeChild(
                                      downloadContainer
                                    );
                                  }, 100);
                                  return null;
                                }}
                              </PDFDownloadLink>
                            );
                          }
                        });
                      }}
                      className="p-1 md:p-2 rounded-full hover:bg-gray-100"
                    >
                      <FileText className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="bg-gray-800 text-white text-xs rounded px-2 py-1 hidden md:block"
                    style={{ zIndex: 9999 }}
                  >
                    View PDF Version
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: "Tenancy Agreement",
                          html: `
                            <div class="text-left space-y-6 p-4">
                              ${Object.entries(agreementData)
                                .map(
                                  ([title, content]) => `
                                <div class="mb-6">
                                  <h3 class="text-xl font-semibold text-black-600 mb-3">${title}</h3>
                                  <div class="prose max-w-none">
                                    ${
                                      Array.isArray(content)
                                        ? content
                                            .map(
                                              (item) =>
                                                `<p class="mb-2">• ${item}</p>`
                                            )
                                            .join("")
                                        : `<p>${content}</p>`
                                    }
                                  </div>
                                </div>
                              `
                                )
                                .join("")}
                            </div>
                          `,
                          width: "80%",
                          showCloseButton: true,
                          showConfirmButton: false,
                          customClass: {
                            container: "agreement-modal",
                            popup: "agreement-modal-popup",
                            content: "agreement-modal-content",
                          },
                          didOpen: () => {
                            const signaturesContainer = document.getElementById(
                              "signatures-container"
                            );
                            if (signaturesContainer) {
                              const root =
                                ReactDOM.createRoot(signaturesContainer);
                              root.render(<SignatureDisplay contractId={id} />);
                            }
                          },
                          willClose: () => {
                            const signaturesContainer = document.getElementById(
                              "signatures-container"
                            );
                            if (signaturesContainer) {
                              signaturesContainer.innerHTML = "";
                            }
                          },
                        });
                      }}
                      className="p-1 md:p-2 rounded-full hover:bg-gray-100"
                    >
                      <Maximize2 className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="bg-gray-800 text-white text-xs rounded px-2 py-1 hidden md:block"
                    style={{ zIndex: 9999 }}
                  >
                    Fullscreen
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
          </div>

          <div
            id="agreement-content"
            className="overflow-auto md:max-h-96 h-fit"
          >
            <div className="space-y-6">
              {Object.entries(agreementData).map(([title, content]) => (
                <div key={title}>
                  <h3 className="text-lg font-semibold mb-3">{title}</h3>
                  <div className="prose max-w-none">
                    {Array.isArray(content) ? (
                      <ul className="list-disc pl-6 space-y-2">
                        {content.map((item, index) => (
                          <li key={index} className="text-gray-700">
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700">{content}</p>
                    )}
                  </div>
                </div>
              ))}
              <SignatureDisplay contractId={id} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="md:hidden fixed bottom-12 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex items-center justify-between max-w-screen-lg mx-auto">
          <div className="flex-1">
            <ContractActions contractId={contract._id} />
          </div>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="ml-4 bg-primary-600 text-white p-3 rounded-full shadow-lg"
          >
            {isChatOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <MessageSquare className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Right Section Wrapper */}
      <div
        className={`fixed md:relative inset-0 md:inset-auto bg-white md:bg-transparent z-40 md:z-auto
          transform transition-transform duration-300 ease-in-out
          ${isChatOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
          w-full md:w-auto mx-2 md:mx-0 pt-16 md:pt-0 pb-20 md:pb-0`}
        style={{
          width: window.innerWidth >= 768 ? `${100 - leftWidth}%` : "100%",
        }}
      >
        {/* Chat Section */}
        <div className="bg-white shadow-md rounded-md p-3 md:p-6 w-full h-[calc(100vh-8rem)] md:h-fit overflow-auto">
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h3 className="text-lg font-semibold">Chat</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {["owner", "property manager", "careTaker"].includes(userRole) ? (
            <OwnerModificationChat
              contractId={contract._id}
              ownerId={contract.ownerId}
              clientId={contract.clientId}
            />
          ) : userRole === "buyer" ? (
            <ClientModificationChat
              contractId={contract._id}
              clientId={contract.clientId}
              ownerId={contract.ownerId}
            />
          ) : null}
        </div>

        {/* Proceed to Sign Button Section - Desktop Only */}
        <div className="hidden md:flex justify-center px-4 bg-white shadow-md rounded-md p-3 md:p-6 w-full max-h-fit md:h-fit my-4">
          <ContractActions contractId={contract._id} />
        </div>
      </div>

      <EditAgreementDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleAgreementUpdate}
        data={agreementData}
        setRentAndDurationText={setRentAndDurationText}
        setTenantObligations={setTenantObligations}
        setLandlordObligations={setLandlordObligations}
        signedRoles={signedRoles}
      />
    </div>
  );
};

export default ContractDashboard;
