import React, { useState, useRef } from "react";
import { updateUserData } from "utils/api/user/updateUserData";
import { useSnackbar } from "notistack";
import { fetchUserData } from "utils/api/user/fetchUserData";
import AgentProfileModal from "./AgentProfileModal";

const AgentProfilePhoto = ({ agentId, agentData, onAgentDataUpdate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [passport, setPassport] = useState(agentData?.passport || null);
  const [passportChanged, setPassportChanged] = useState(false);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePassportChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassport(reader.result); // Show preview
        setFile(selectedFile); // Save the selected file
        setPassportChanged(true); // Mark as changed
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleProfileUpdate = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("passport", file);

      // Include additional user data if required
      for (const key in userData) {
        formData.append(key, userData[key]);
      }

      const res = await updateUserData(formData);

      if (res.passport) {
        const updatedPassportUrl = `${res.passport}`;
        setPassport(updatedPassportUrl);
        enqueueSnackbar("Successfully updated user profile!", {
          variant: "success",
        });

        // Optionally re-fetch user data if the backend sends partial updates
        if (onAgentDataUpdate) {
          const updatedUserData = await fetchUserData(userId);
          onUserDataUpdate(updatedUserData);
        }

        setPassportChanged(false);
        setFile(null); // Clear file state
      }
    } catch (error) {
      console.error("Failed to update user data: ", error);
      enqueueSnackbar("Failed to update user profile photo!", {
        variant: "error",
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <img
          src={agentData?.passport || "/path/to/default/profile.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-primary-500 object-cover cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      {/* {isModalOpen && (
        <AgentProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <img
            src={passport || "/path/to/default/profile.png"}
            alt="Full-size Profile"
            className="w-full h-auto max-w-screen-lg max-h-screen"
          />
        </AgentProfileModal>
      )} */}
    </div>
  );
};

export default AgentProfilePhoto;
