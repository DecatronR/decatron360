import React from "react";
import { FaCopy, FaTimes } from "react-icons/fa";

const ShareModal = ({ isOpen, onClose, shareUrl }) => {
  if (!isOpen) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-80">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Share Property</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex items-center border rounded-lg p-2 mb-3">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="w-full text-sm bg-transparent outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="ml-2 text-blue-600 hover:text-blue-800"
          >
            <FaCopy />
          </button>
        </div>

        {navigator.share && (
          <button
            onClick={() =>
              navigator.share({ title: "Check this property", url: shareUrl })
            }
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          >
            Share via Mobile
          </button>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
