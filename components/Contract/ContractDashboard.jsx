"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Wallet,
  CalendarDays,
  MessageSquare,
  X,
  ArrowLeft,
  FileText,
  Maximize2,
  Pencil,
  Loader2,
  Image as ImageIcon,
  UserPlus,
} from "lucide-react";
import { fetchContractById } from "utils/api/contract/fetchContractById";
import { truncateText } from "utils/helpers/truncateText";
import OwnerModificationChat from "components/RentalAgreement/Chat/OwnerModificationChat";
import ClientModificationChat from "components/RentalAgreement/Chat/ClientModificationChat";
import { fetchUserData } from "utils/api/user/fetchUserData";
import { fetchPropertyData } from "utils/api/properties/fetchPropertyData";
import * as Tooltip from "@radix-ui/react-tooltip";
import EditAgreementDialog from "./EditAgreementDialogue";
import { useAuth } from "context/AuthContext";
import { updateAgreement } from "utils/api/contract/updateAgreement";
import { fetchTemplateDetails } from "app/utils/eSignature/fetchTemplateDetails";
import ContractActions from "./ContractActions";
import SignatureStatus from "./SignatureStatus";
import PropertyDetails from "./PropertyDetails";
import { fetchSignatureByContractId } from "utils/api/eSignature/fetchSignatureByContractId";
import SignatureDisplay from "./SignatureDisplay";
import Swal from "sweetalert2";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import RentalAgreementTemplate from "components/RentalAgreement/RentalAgreementTemplate";
import ReactDOM from "react-dom/client";
import { parseAmount } from "utils/helpers/formatCurrency";
import { fetchUserPaymentsByContractId } from "utils/api/manualPayment/fetchUserPaymentsByContractId";
import SignatureDialog from "./SignatureDialogue";
import WitnessInviteDialog from "./WitnessInviteDialog";

const ContractDashboard = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const rentalAgreementTemplateId =
    process.env.NEXT_PUBLIC_ZOHO_SIGN_RENTAL_AGREEMENT_TEMPLATE_ID;

  const [userRole, setUserRole] = useState();
  const [contract, setContract] = useState(null);
  const [propertyData, setPropertyData] = useState();
  const [ownerData, setOwnerData] = useState();
  const [tenantData, setTenantData] = useState();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [signedRoles, setSignedRoles] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isPaymentButtonDisabled, setIsPaymentButtonDisabled] = useState(false);
  const [isActionButtonsDisabled, setIsActionButtonsDisabled] = useState(false);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [isWitnessDialogOpen, setIsWitnessDialogOpen] = useState(false);

  const [rentAndDurationText, setRentAndDurationText] = useState([
    "Loading tenancy details...",
    "Loading caution fee details...",
    "Loading agency fee details...",
  ]);

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
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    handleFetchContractDetails();
  }, [id]);

  useEffect(() => {
    const handleFetchPropertyData = async () => {
      if (!contract?.propertyId) return;

      try {
        const res = await fetchPropertyData(contract.propertyId);
        setPropertyData(res);
        console.log("property data: ", res);
        console.log("property data.data: ", res.data);
        console.log("property photos: ", res.data?.photos);
        console.log("first photo: ", res.data?.photos?.[0]);
        console.log("first photo path: ", res.data?.photos?.[0]?.path);
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

  useEffect(() => {
    const handleFetchOwnerData = async () => {
      if (!contract?.ownerId) return;

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
      if (!contract?.clientId) return;

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

  // Fetch payment status for mobile actions
  useEffect(() => {
    const handleFetchPaymentStatus = async () => {
      if (!contract?._id) return;

      try {
        const res = await fetchUserPaymentsByContractId(contract._id);
        console.log("Payment status: ", res);
        const payments = res.data;
        setPaymentStatus(payments.status);

        // Update button states
        const paymentDisabled =
          payments.status === "pending" || payments.status === "confirmed";
        setIsPaymentButtonDisabled(paymentDisabled);

        const actionDisabled = ["buyer", "renter"].includes(user?.role)
          ? payments.status !== "confirmed"
          : false;
        setIsActionButtonsDisabled(actionDisabled);

        // Debug logging
        console.log("Mobile Debug - User role:", user?.role);
        console.log("Mobile Debug - Payment status:", payments.status);
        console.log("Mobile Debug - Action buttons disabled:", actionDisabled);
        console.log("Mobile Debug - Payment button disabled:", paymentDisabled);
      } catch (error) {
        console.error("Error fetching payment status:", error);
        setPaymentStatus(null);
        setIsPaymentButtonDisabled(false);
        setIsActionButtonsDisabled(false);
      }
    };

    handleFetchPaymentStatus();
  }, [contract?._id, user?.role]);

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

  //routing to payment page
  const handlePayment = (contractId) => {
    const totalAmount =
      parseAmount(propertyData.data.price) +
      parseAmount(propertyData.data.cautionFee) +
      parseAmount(propertyData.data.agencyFee);
    console.log("Total amount: ", totalAmount);
    router.push(`/manual-payment/${contractId}?amount=${totalAmount}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading contract details...</p>
        </div>
      </div>
    );
  }

  if (!contract || !propertyData || !propertyData.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Contract Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            The contract you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.back()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                {/* Property Image in Header */}
                {(() => {
                  console.log(
                    "Rendering ContractDashboard header - propertyData:",
                    propertyData
                  );
                  console.log("propertyData?.photos:", propertyData?.photos);
                  console.log("photos length:", propertyData?.photos?.length);
                  console.log(
                    "first photo path:",
                    propertyData?.photos?.[0]?.path
                  );

                  return (
                    propertyData?.photos &&
                    propertyData.photos.length > 0 && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                        <img
                          src={propertyData.photos[0].path}
                          alt="Property"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log(
                              "ContractDashboard header image failed to load:",
                              propertyData.photos[0].path
                            );
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                          onLoad={() => {
                            console.log(
                              "ContractDashboard header image loaded successfully:",
                              propertyData.photos[0].path
                            );
                          }}
                        />
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center hidden">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    )
                  );
                })()}
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Contract Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                    {truncateText(
                      propertyData?.data?.title ||
                        contract.propertyName ||
                        "Property",
                      40
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Contract #{id.slice(-8)}</span>
              <span className="sm:hidden">#{id.slice(-6)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content (Scrollable) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Image Card - Simplified */}
            {(() => {
              console.log(
                "Rendering ContractDashboard property card - propertyData:",
                propertyData
              );
              console.log("propertyData?.photos:", propertyData?.photos);
              console.log("photos length:", propertyData?.photos?.length);
              console.log("first photo path:", propertyData?.photos?.[0]?.path);

              return (
                propertyData?.photos &&
                propertyData.photos.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="relative h-32 sm:h-40">
                      <img
                        src={propertyData.photos[0].path}
                        alt="Property"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log(
                            "ContractDashboard property card image failed to load:",
                            propertyData.photos[0].path
                          );
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                        onLoad={() => {
                          console.log(
                            "ContractDashboard property card image loaded successfully:",
                            propertyData.photos[0].path
                          );
                        }}
                      />
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center hidden">
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-500">
                            Property Image
                          </p>
                        </div>
                      </div>
                      {/* Property Badge */}
                      <div className="absolute top-2 left-2">
                        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                          {propertyData.data.listingType || "Property"}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              );
            })()}

            {/* Signature Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
                  </div>
                  Signature Status
                </h2>
                <SignatureStatus contractId={contract._id} />
              </div>
            </div>

            {/* Property Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  Property Details
                </h2>
                <PropertyDetails
                  contract={contract}
                  propertyData={propertyData}
                />
              </div>
            </div>

            {/* Tenancy Agreement Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    </div>
                    Tenancy Agreement Terms
                  </h2>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {contract?.ownerId === user?.id && (
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <button
                              onClick={() =>
                                signedRoles.length === 0 &&
                                setIsEditDialogOpen(true)
                              }
                              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                                signedRoles.length > 0
                                  ? "opacity-50 cursor-not-allowed bg-gray-100"
                                  : "hover:bg-gray-100 bg-white border border-gray-200"
                              }`}
                              disabled={signedRoles.length > 0}
                            >
                              <Pencil className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
                            </button>
                          </Tooltip.Trigger>
                          <Tooltip.Content
                            side="bottom"
                            sideOffset={4}
                            className="bg-gray-800 text-white text-xs rounded px-2 py-1"
                          >
                            {signedRoles.length > 0
                              ? "Cannot edit after signatures"
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
                                  const pdfViewer =
                                    document.createElement("div");
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
                                        cautionFee={
                                          propertyData.data.cautionFee
                                        }
                                        agencyFee={propertyData.data.agencyFee}
                                        latePaymentFee={
                                          propertyData.data.latePaymentFee
                                        }
                                        rentAndDurationText={
                                          rentAndDurationText
                                        }
                                        tenantObligations={tenantObligations}
                                        landlordObligations={
                                          landlordObligations
                                        }
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
                                                signature:
                                                  sig.witness.signature,
                                                timestamp:
                                                  sig.witness.timestamp,
                                              }
                                            : null,
                                        }))}
                                        contractId={id}
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

                                  const root =
                                    ReactDOM.createRoot(downloadContainer);
                                  root.render(
                                    <PDFDownloadLink
                                      document={
                                        <RentalAgreementTemplate
                                          ownerName={ownerData.name}
                                          tenantName={tenantData.name}
                                          propertyNeighbourhood={
                                            propertyData.data.neighbourhood
                                          }
                                          propertyState={
                                            propertyData.data.state
                                          }
                                          rentPrice={propertyData.data.price}
                                          cautionFee={
                                            propertyData.data.cautionFee
                                          }
                                          agencyFee={
                                            propertyData.data.agencyFee
                                          }
                                          latePaymentFee={
                                            propertyData.data.latePaymentFee
                                          }
                                          rentAndDurationText={
                                            rentAndDurationText
                                          }
                                          tenantObligations={tenantObligations}
                                          landlordObligations={
                                            landlordObligations
                                          }
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
                                                  signature:
                                                    sig.witness.signature,
                                                  timestamp:
                                                    sig.witness.timestamp,
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
                                        const link =
                                          document.createElement("a");
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
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 bg-white border border-gray-200 transition-colors"
                          >
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                          </button>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="bottom"
                          sideOffset={4}
                          className="bg-gray-800 text-white text-xs rounded px-2 py-1"
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
                                  const signaturesContainer =
                                    document.getElementById(
                                      "signatures-container"
                                    );
                                  if (signaturesContainer) {
                                    const root =
                                      ReactDOM.createRoot(signaturesContainer);
                                    root.render(
                                      <SignatureDisplay contractId={id} />
                                    );
                                  }
                                },
                                willClose: () => {
                                  const signaturesContainer =
                                    document.getElementById(
                                      "signatures-container"
                                    );
                                  if (signaturesContainer) {
                                    signaturesContainer.innerHTML = "";
                                  }
                                },
                              });
                            }}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 bg-white border border-gray-200 transition-colors"
                          >
                            <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                          </button>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          side="bottom"
                          sideOffset={4}
                          className="bg-gray-800 text-white text-xs rounded px-2 py-1"
                        >
                          Fullscreen
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6 max-h-64 sm:max-h-96 overflow-y-auto custom-scrollbar">
                  {Object.entries(agreementData).map(([title, content]) => (
                    <div
                      key={title}
                      className="border-b border-gray-100 last:border-0 pb-3 sm:pb-4"
                    >
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                        {title}
                      </h3>
                      <div className="prose max-w-none">
                        {Array.isArray(content) ? (
                          <ul className="list-disc pl-4 sm:pl-6 space-y-1 sm:space-y-2">
                            {content.map((item, index) => (
                              <li
                                key={index}
                                className="text-xs sm:text-sm text-gray-700"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs sm:text-sm text-gray-700">
                            {content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  <SignatureDisplay contractId={id} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Chat & Actions (Fixed/Sticky) */}
          <div className="hidden lg:block lg:sticky lg:top-6 lg:self-start space-y-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
            {/* Contract Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Wallet className="w-4 h-4 text-purple-600" />
                  </div>
                  Contract Actions
                </h2>
                <ContractActions
                  contractId={contract._id}
                  handlePayment={handlePayment}
                />
              </div>
            </div>

            {/* Chat Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <MessageSquare className="w-4 h-4 text-orange-600" />
                    </div>
                    Chat
                  </h2>
                </div>

                <div className="h-96 overflow-y-auto">
                  {["owner", "property manager", "careTaker"].includes(
                    userRole
                  ) ? (
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
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        Chat not available for your role
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Chat Trigger */}
      <div className="lg:hidden fixed bottom-44 right-6 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-12 h-12 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-110 ${
            isChatOpen
              ? "bg-red-500 hover:bg-red-600"
              : "bg-primary-600 hover:bg-primary-700"
          } flex items-center justify-center`}
        >
          {isChatOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <MessageSquare className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Chat Overlay */}
      {isChatOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          onClick={(e) => {
            // Close chat when clicking on backdrop
            if (e.target === e.currentTarget) {
              setIsChatOpen(false);
            }
          }}
        >
          <div className="w-full bg-white rounded-t-3xl shadow-2xl animate-slide-up">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Contract Chat
                  </h3>
                  <p className="text-sm text-gray-600">
                    {["owner", "property manager", "careTaker"].includes(
                      userRole
                    )
                      ? "Chat with tenant"
                      : "Chat with property owner"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Chat Content */}
            <div className="h-96 overflow-hidden">
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
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-4 p-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 font-medium">
                      Chat not available
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Chat is not available for your role
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Contract Actions - Compact */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="p-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center">
                  <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                    <Wallet className="w-3 h-3 text-purple-600" />
                  </div>
                  Actions
                </h2>
                {/* Payment Status - Compact */}
                {["buyer", "renter"].includes(user.role) && (
                  <div className="flex items-center space-x-1">
                    {loading ? (
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                    ) : (
                      <div
                        className={`w-2 h-2 rounded-full ${
                          paymentStatus === "confirmed"
                            ? "bg-green-500"
                            : paymentStatus === "pending"
                            ? "bg-yellow-500"
                            : paymentStatus === "failed"
                            ? "bg-red-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    )}
                    <span className="text-xs text-gray-500">
                      {paymentStatus
                        ? paymentStatus.charAt(0).toUpperCase() +
                          paymentStatus.slice(1)
                        : "Not Paid"}
                    </span>
                    {/* Debug indicator */}
                    <span className="text-xs text-gray-400 ml-1">
                      {isActionButtonsDisabled ? "(Disabled)" : "(Enabled)"}
                    </span>
                  </div>
                )}
              </div>

              {/* Compact Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {["buyer", "renter"].includes(user.role) && (
                  <button
                    onClick={() => handlePayment(contract._id)}
                    disabled={isPaymentButtonDisabled}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isPaymentButtonDisabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700"
                    }`}
                  >
                    <Wallet className="w-4 h-4 mb-1" />
                    <span>Payment</span>
                  </button>
                )}

                <button
                  onClick={() =>
                    !isActionButtonsDisabled && setIsSignatureDialogOpen(true)
                  }
                  disabled={isActionButtonsDisabled}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActionButtonsDisabled
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                      : "bg-primary-600 text-white shadow-md hover:shadow-lg hover:bg-primary-700"
                  }`}
                >
                  <FileText
                    className={`w-4 h-4 mb-1 ${
                      isActionButtonsDisabled ? "text-gray-400" : "text-white"
                    }`}
                  />
                  <span>Sign</span>
                </button>

                <button
                  onClick={() =>
                    !isActionButtonsDisabled && setIsWitnessDialogOpen(true)
                  }
                  disabled={isActionButtonsDisabled}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                    isActionButtonsDisabled
                      ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50 opacity-50"
                      : "border-primary-600 text-primary-600 bg-white hover:bg-primary-50 hover:border-primary-700 hover:text-primary-700"
                  }`}
                >
                  <UserPlus
                    className={`w-4 h-4 mb-1 ${
                      isActionButtonsDisabled
                        ? "text-gray-400"
                        : "text-primary-600"
                    }`}
                  />
                  <span>Witness</span>
                </button>
              </div>
            </div>
          </div>
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

      {/* Mobile Dialog Components */}
      <SignatureDialog
        open={isSignatureDialogOpen}
        onOpenChange={setIsSignatureDialogOpen}
        contractId={contract?._id}
      />

      <WitnessInviteDialog
        open={isWitnessDialogOpen}
        onOpenChange={setIsWitnessDialogOpen}
        contractId={contract?._id}
      />
    </div>
  );
};

export default ContractDashboard;
