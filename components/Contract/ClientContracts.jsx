"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchClientContracts } from "utils/api/contract/fetchClientContracts";
import { truncateText } from "utils/helpers/truncateText";
import { MapPin, Wallet } from "lucide-react";

const STATUS_COLORS = {
  completed: "bg-green-500",
  pending: "bg-yellow-500",
  ended: "bg-red-500",
};

const tabs = ["All", "Completed", "Pending", "Ended"];

const ClientContract = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [contracts, setContracts] = useState(null);

  useEffect(() => {
    const handleFetchClientContract = async () => {
      try {
        const res = await fetchClientContracts();
        console.log("Client contracts: ", res);
        setContracts(res);
      } catch (error) {
        console.log();
      }
    };

    handleFetchClientContract();
  }, []);

  const filteredContracts =
    activeTab === "All"
      ? contracts || []
      : (contracts || []).filter(
          (contract) =>
            contract.status.toLowerCase() === activeTab.toLowerCase()
        );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 px-4 md:px-8">
      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col p-6 overflow-auto">
        <h1 className="text-2xl font-semibold mb-4 text-center md:text-left">
          Contract Dashboard
        </h1>

        {/* Status Tabs */}
        <div className="flex space-x-4 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 mb-4 flex-wrap justify-center md:justify-start">
          <span className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-sm">Completed</span>
          </span>
          <span className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-sm">Pending</span>
          </span>
          <span className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm">Ended</span>
          </span>
        </div>

        {/* Contracts Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredContracts.length > 0 ? (
            filteredContracts.map((contract) => (
              <Link
                href={`/contract-dashboard/${contract._id}`}
                key={contract._id}
              >
                <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between transition hover:shadow-md hover:-translate-y-0.5 duration-200">
                  <div className="mb-3 space-y-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {truncateText(contract.propertyName, 30)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Owner: {contract.ownerName}
                    </p>

                    {/* Property Location */}
                    <div className="flex items-center text-sm text-gray-600 space-x-2">
                      <span className="p-1 bg-gray-100 rounded-full">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </span>
                      <span>{truncateText(contract.propertyLocation, 30)}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center text-sm text-gray-600 space-x-2">
                      <span className="p-1 bg-gray-100 rounded-full">
                        <Wallet className="w-4 h-4 text-green-600" />
                      </span>
                      <span>
                        NGN{" "}
                        {new Intl.NumberFormat().format(contract.propertyPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs font-medium text-white rounded-full w-max ${
                      STATUS_COLORS[contract.status]
                    }`}
                  >
                    {contract.status}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No contracts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientContract;
