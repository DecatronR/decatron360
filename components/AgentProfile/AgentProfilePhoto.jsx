import React, { useState } from "react";
import { User, X } from "lucide-react";
import { createPortal } from "react-dom";

const AgentProfilePhoto = ({ agentData }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleImageClick = () => {
    if (agentData?.passport) {
      setShowPreview(true);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  return (
    <div className="flex flex-col items-center mt-5">
      <div className="relative mb-4 group">
        <div className="relative">
          {agentData?.passport ? (
            // Show current profile photo
            <div className="relative">
              <img
                src={agentData.passport}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-primary-500 object-cover cursor-pointer transition-transform hover:scale-105"
                onClick={handleImageClick}
              />
            </div>
          ) : (
            // Show placeholder
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-primary-500 bg-gray-100 flex items-center justify-center cursor-pointer">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-size Image Preview Modal */}
      {showPreview &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4 pt-24">
            <div className="relative max-w-4xl w-full">
              <div className="relative">
                <img
                  src={agentData.passport}
                  alt="Profile Preview"
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
                <button
                  onClick={handleClosePreview}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default AgentProfilePhoto;
