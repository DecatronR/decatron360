"use client";
import { useState } from "react";
import OwnerConversationList from "components/RentalAgreement/Chat/OwnerConversationList";
import OwnerModificationChat from "components/RentalAgreement/Chat/OwnerModificationChat";

const contractsData = [
  { id: 1, title: "Website Redesign", status: "Completed" },
  { id: 2, title: "Mobile App", status: "Pending" },
  { id: 3, title: "Marketing Campaign", status: "Ended" },
  { id: 4, title: "Landing Page", status: "Pending" },
];

const STATUS_COLORS = {
  Completed: "bg-green-500",
  Pending: "bg-yellow-500",
  Ended: "bg-red-500",
};

const tabs = ["All", "Completed", "Pending", "Ended"];

const ContractsDashboard = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedTenant, setSelectedTenant] = useState(null);

  const filteredContracts =
    activeTab === "All"
      ? contractsData
      : contractsData.filter((contract) => contract.status === activeTab);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar or Chat List */}
      {!selectedTenant ? (
        <OwnerConversationList onTenantSelect={setSelectedTenant} />
      ) : (
        <OwnerModificationChat tenantId={selectedTenant} />
      )}

      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col p-6 overflow-auto">
        <h1 className="text-2xl font-semibold mb-4">Contract Dashboard</h1>

        {/* Status Tabs */}
        <div className="flex space-x-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full transition ${
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
        <div className="flex items-center space-x-4 mb-4">
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
              <div
                key={contract.id}
                className="p-4 bg-white rounded-lg shadow border border-gray-200 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-medium">{contract.title}</h3>
                </div>
                <span
                  className={`inline-block mt-4 px-3 py-1 text-xs text-white rounded-full w-max ${
                    STATUS_COLORS[contract.status]
                  }`}
                >
                  {contract.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No contracts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractsDashboard;
