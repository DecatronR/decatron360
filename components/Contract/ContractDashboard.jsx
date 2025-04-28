"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Wallet, CalendarDays } from "lucide-react";
import { fetchContractById } from "utils/api/contract/fetchContractById";
import { truncateText } from "utils/helpers/truncateText";
import OwnerModificationChat from "components/RentalAgreement/Chat/OwnerModificationChat";
import ClientModificationChat from "components/RentalAgreement/Chat/ClientModificationChat";
import { fetchUserData } from "utils/api/user/fetchUserData";
import { fetchPropertyData } from "utils/api/properties/fetchPropertyData";
import RentalAgreementWrapper from "components/RentalAgreement/RentalAgreementWrapper";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Pencil, Maximize2, ArrowLeft } from "lucide-react";
import EditAgreementDialog from "./EditAgreementDialogue";
import { useAuth } from "context/AuthContext";

const STATUS_COLORS = {
  completed: "bg-green-500",
  pending: "bg-yellow-500",
  ended: "bg-red-500",
};

const ContractDashboard = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState();
  const [contract, setContract] = useState(null);
  const [leftWidth, setLeftWidth] = useState(70); // Default 70% for the left section
  const [isDragging, setIsDragging] = useState(false);
  const [propertyData, setPropertyData] = useState();
  const [ownerData, setOwnerData] = useState();
  const [tenantData, setTenantData] = useState();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
    "Provide one month’s notice before expiration for possession delivery.",
  ]);

  const agreementData = {
    "Rent and Duration": rentAndDurationText,
    "Tenant's Obligation": tenantObligations,
    "Landlord's Obligation": landlordObligations,
  };

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

  useEffect(() => {
    const handleFetchContractDetails = async () => {
      try {
        const res = await fetchContractById(id);
        console.log("Contract details: ", res);
        setContract(res.data);
      } catch (error) {
        console.error("Failed to fetch contract details: ", error);
      }
    };

    handleFetchContractDetails();
  }, [id]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

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
    const handleFetchPropertyData = async () => {
      try {
        const res = await fetchPropertyData(contract.propertyId);
        setPropertyData(res);
        setOwnerId(res.data.userID);
        console.log("property data: ", res);
      } catch (error) {
        console.log("Failed to fetch property data: ", error);
      }
    };

    handleFetchPropertyData();
  }, [contract]);

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

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen); // Toggle fullscreen state
  };

  const handleAgreementUpdate = () => {
    console.log("Update agreement successful");
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
      className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden px-2 md:px-6 py-2 md:py-4"
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
          className="text-sm text-blue-600 mb-4 hover:underline"
        >
          <span className="flex items-center">
            <ArrowLeft className="mr-2" /> Back
          </span>
        </button>

        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 px-2 md:px-0">
          Contract:{" "}
          {truncateText(
            contract.propertyName,
            window.innerWidth < 768 ? 25 : 40
          )}
        </h1>

        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border mb-4 md:mb-6 mx-2 md:mx-0">
          <div className="space-y-3 md:space-y-4">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Client</p>
              <p className="font-medium text-gray-800">{contract.clientName}</p>
            </div>

            <div className="flex items-center text-sm md:text-base text-gray-700 space-x-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm md:text-base">
                {contract.propertyLocation}
              </span>
            </div>

            <div className="flex items-center text-sm md:text-base text-gray-700 space-x-2">
              <Wallet className="w-4 h-4 text-green-600" />
              <span className="text-sm md:text-base">
                NGN {new Intl.NumberFormat().format(contract.propertyPrice)}
              </span>
            </div>

            <div className="flex items-center text-sm md:text-base text-gray-700 space-x-2">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <span className="text-sm md:text-base">
                {new Date(contract.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div>
              <p className="text-xs md:text-sm text-gray-500">
                Agreement Terms
              </p>
              <p className="text-sm md:text-base text-gray-700">
                {contract.terms}
              </p>
            </div>

            <span
              className={`inline-block mt-2 px-3 py-1 text-xs font-medium text-white rounded-full w-max ${
                STATUS_COLORS[contract.status]
              }`}
            >
              {contract.status}
            </span>
          </div>
        </div>

        {/* Tenancy Agreement Template */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border mb-4 md:mb-6 mx-2 md:mx-0 min-h-[400px]">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-lg md:text-xl font-bold">Tenancy Agreement</h2>
            <div className="flex items-center space-x-2 md:space-x-4">
              {contract?.ownerId === user?.id && (
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        onClick={() => setIsEditDialogOpen(true)}
                        className="p-1 md:p-2 rounded-full hover:bg-gray-100"
                      >
                        <Pencil className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="bottom"
                      sideOffset={4}
                      className="bg-gray-800 text-white text-xs rounded px-2 py-1 hidden md:block"
                    >
                      Edit Agreement
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              )}
              <button
                onClick={toggleFullScreen}
                className="p-1 md:p-2 rounded-full hover:bg-gray-100"
              >
                <Maximize2 className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              </button>
            </div>
          </div>

          <div
            id="agreement-content"
            className="overflow-auto md:max-h-96 h-fit"
          >
            <RentalAgreementWrapper
              propertyData={propertyData}
              ownerData={ownerData}
              tenantData={tenantData}
              rentAndDurationText={rentAndDurationText}
              tenantObligations={tenantObligations}
              landlordObligations={landlordObligations}
              isFullScreen={isFullScreen}
              toggleFullScreen={toggleFullScreen}
            />
          </div>
        </div>
      </div>

      {/* Right Section - Chat Component */}
      <div
        className={`
        bg-white shadow-md rounded-md p-3 md:p-6 flex flex-col 
        w-full h-[500px] md:h-full md:w-auto mx-2 md:mx-0`}
        style={{
          width: window.innerWidth >= 768 ? `${100 - leftWidth}%` : "100%",
        }}
      >
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

      <EditAgreementDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleAgreementUpdate}
        data={agreementData}
      />
    </div>
  );
};

export default ContractDashboard;
