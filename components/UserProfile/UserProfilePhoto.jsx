import React, { useState, useRef, useEffect } from "react";
import { updateUserData } from "@/utils/api/user/updateUserData";
import { useSnackbar } from "notistack";
import { fetchUserData } from "@/utils/api/user/fetchUserData";

const UserProfilePhoto = ({ userId, userData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [passport, setPassport] = useState(userData?.passport);
  const [passportChanged, setPassportChanged] = useState(false);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const BASE_URL = "http://localhost:8080/";
  // Update photo state if parent changes userData (e.g., after a re-fetch)
  // useEffect(() => {
  //   if (userData?.passport) {
  //     console.log("userData now: ", userData);
  //     setPassport(userData.passport);
  //   }
  // }, [userData?.passport]);

  useEffect(() => {
    if (!passportChanged) return;
    const handleFetchPassport = async () => {
      try {
        const res = await fetchUserData(userId);
        console.log("Passport: ", res.passport);
        setPassport(res.passport);
      } catch (error) {
        console.loe("Failed to fetch passport: ", error);
      }
    };
    handleFetchPassport();
  }, [passportChanged]);

  const handlePassportChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassport(reader.result); // Set local photo preview
        setFile(selectedFile); // Save the selected file
        setPassportChanged(true);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const userDataUpdate = { ...userData };

      // Create a FormData object
      const formData = new FormData();
      formData.append("passport", file); // Append the file to FormData
      // Append other user data
      for (const key in userDataUpdate) {
        formData.append(key, userDataUpdate[key]);
      }

      // Send the FormData to the backend
      const res = await updateUserData(formData);
      console.log("updated data: ", res);

      if (res.passport) {
        console.log("Image absolute path: ", `${BASE_URL}${res.passport}`);
        setPassport(`${BASE_URL}${res.passport}`);
      }

      enqueueSnackbar("Successfully updated user profile!", {
        variant: "success",
      });
      setPassportChanged(false);
    } catch (error) {
      console.log("Failed to update user data: ", error);
      enqueueSnackbar("Failed to update user profile photo!", {
        variant: "error",
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <img
          src={passport || "/path/to/default/profile.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-primary-500 object-cover cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handlePassportChange}
          className="hidden" // Hide the input field
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
