import React, { useState, useRef } from "react";

const AgentProfilePhoto = ({ agentPhoto }) => {
  const [photo, setPhoto] = useState(agentPhoto);
  const fileInputRef = useRef(null);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <img
          // src={photo || "/path/to/default/profile.png"} // Default profile photo
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-primary-500 object-cover cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handlePhotoChange}
          className="hidden" // Hide the input field
          aria-label="Change Profile Photo"
        />
      </div>
      <p className="text-center mt-2 text-sm text-gray-600">
        Click on the photo to change it.
      </p>
    </div>
  );
};

export default AgentProfilePhoto;
