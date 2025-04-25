"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Wallet, CalendarDays } from "lucide-react";
import { fetchContractById } from "utils/api/contract/fetchContractById";
import { truncateText } from "utils/helpers/truncateText";
import OwnerModificationChat from "components/RentalAgreement/Chat/OwnerModificationChat";
import ClientModificationChat from "components/RentalAgreement/Chat/ClientModificationChat";
import { fetchUserData } from "utils/api/user/fetchUserData";

const STATUS_COLORS = {
  completed: "bg-green-500",
  pending: "bg-yellow-500",
  ended: "bg-red-500",
};

const ContractDetailsContent = () => {
  const { id } = useParams();
  const router = useRouter();
  const [userRole, setUserRole] = useState();
  const [contract, setContract] = useState(null);
  const [leftWidth, setLeftWidth] = useState(70); // Default 70% for the left section
  const [isDragging, setIsDragging] = useState(false);

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

  if (!contract) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading contract details...</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden px-6 py-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Left Section - Contract Details */}
      <div
        className="transition-all duration-200 ease-in-out overflow-auto max-w-screen-lg mx-auto"
        style={{ width: `${leftWidth}%` }}
      >
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-600 mb-4 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold mb-6">
          Contract: {truncateText(contract.propertyName, 40)}
        </h1>

        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Client</p>
              <p className="font-medium text-gray-800">{contract.clientName}</p>
            </div>

            <div className="flex items-center text-gray-700 space-x-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>{contract.propertyLocation}</span>
            </div>

            <div className="flex items-center text-gray-700 space-x-2">
              <Wallet className="w-4 h-4 text-green-600" />
              <span>
                NGN {new Intl.NumberFormat().format(contract.propertyPrice)}
              </span>
            </div>

            <div className="flex items-center text-gray-700 space-x-2">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <span>
                {contract.startDate} - {contract.endDate}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">Agreement Terms</p>
              <p className="text-gray-700">{contract.terms}</p>
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
      </div>

      {/* Right Section - Chat Component */}
      <div
        className="bg-white shadow-md rounded-md p-6 flex flex-col h-full"
        style={{ width: `${100 - leftWidth}%` }}
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
    </div>
  );
};

export default ContractDetailsContent;
