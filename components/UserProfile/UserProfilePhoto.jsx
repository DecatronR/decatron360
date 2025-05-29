import React, { useState, useRef } from "react";
import { updateUserData } from "@/utils/api/user/updateUserData";
import { useSnackbar } from "notistack";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import { User, Pencil, X } from "lucide-react";

const UserProfilePhoto = ({ userId, userData, onUserDataUpdate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [passport, setPassport] = useState(userData?.passport || null);
  const [passportChanged, setPassportChanged] = useState(false);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState("view"); // 'view' or 'edit'

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
      formData.append("id", userId); // Add user ID to the form data

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
      enqueueSnackbar(`Failed to update user profile photo! ${error.message}`, {
        variant: "error",
      });
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent triggering the preview
    fileInputRef.current.click();
  };

  const handleImageClick = () => {
    if (userData?.passport) {
      setPreviewMode("view");
      setShowPreview(true);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    if (previewMode === "edit" && !passportChanged) {
      // If we're in edit mode and haven't saved, revert the preview
      setPassport(userData?.passport || null);
      setFile(null);
    }
  };

  return (
    <div className="flex flex-col items-center mt-5">
      <div className="relative mb-4 group">
        <div className="relative">
          {passportChanged ? (
            // Show preview of selected image
            <div className="relative">
              <img
                src={passport}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full border-4 border-primary-500 object-cover cursor-pointer transition-transform hover:scale-105"
              />
              <button
                onClick={() => {
                  setPassport(userData?.passport || null);
                  setFile(null);
                  setPassportChanged(false);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : userData?.passport ? (
            // Show current profile photo
            <div className="relative">
              <img
                src={userData.passport}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-primary-500 object-cover cursor-pointer transition-transform hover:scale-105"
                onClick={handleImageClick}
              />
              <button
                onClick={handleEditClick}
                className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary-600"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          ) : (
            // Show placeholder
            <div className="relative">
              <div
                className="w-32 h-32 rounded-full border-4 border-primary-500 bg-gray-100 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                onClick={handleEditClick}
              >
                <User className="w-16 h-16 text-gray-400" />
              </div>
              <button
                onClick={handleEditClick}
                className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary-600"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
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
        {passportChanged
          ? "Click the X to cancel or save to confirm"
          : "Click the pencil icon to change your photo"}
      </p>
      {passportChanged && (
        <button
          onClick={handleProfileUpdate}
          className="bg-primary-600 text-white px-4 py-2 rounded-full transition-colors hover:bg-primary-700"
        >
          Save Changes
        </button>
      )}

      {/* Full-size Image Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 pt-24">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={handleClosePreview}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative">
              <img
                src={userData.passport}
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
        </div>
      )}
    </div>
  );
};

export default UserProfilePhoto;
