// AgentProfileModal.js or wherever the modal is defined
import React from "react";

const AgentProfileModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Ensure it only renders when open

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      style={{
        position: "fixed", // Position to be fixed to the screen
        zIndex: 9999, // Ensure this is higher than other elements
      }}
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded"
        style={{ position: "relative", zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()} // Prevent closing modal on image click
      >
        {children}
      </div>
    </div>
  );
};

export default AgentProfileModal;
