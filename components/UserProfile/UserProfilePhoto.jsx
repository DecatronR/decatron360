import React, { useState, useRef } from "react";
import { updateUserData } from "@/utils/api/user/updateUserData";
import { useSnackbar } from "notistack";
import { fetchUserData } from "@/utils/api/user/fetchUserData";

const UserProfilePhoto = ({ userId, userData, onUserDataUpdate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [passport, setPassport] = useState(userData?.passport || null);
  const [passportChanged, setPassportChanged] = useState(false);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

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
        if (onUserDataUpdate) {
          const updatedUserData = await fetchUserData(userId);
          onUserDataUpdate(updatedUserData);
        }

        setPassportChanged(false);
        setFile(null); // Clear file state
      }
    } catch (error) {
      console.error("Failed to update user data: ", error);
      enqueueSnackbar(`Failed to update user profile photo! ${error}`, {
        variant: "error",
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <img
          src={userData?.passport || "/path/to/default/profile.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-primary-500 object-cover cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handlePassportChange}
          className="hidden"
          aria-label="Change Profile Photo"
        />
      </div>
      <p className="text-center mt-2 text-sm text-gray-600">
        Click on the photo to change it.
      </p>
      {passportChanged && (
        <button
          onClick={handleProfileUpdate}
          className="bg-primary-600 text-white px-4 py-2 rounded-md transition-colors hover:bg-primary-700"
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default UserProfilePhoto;
