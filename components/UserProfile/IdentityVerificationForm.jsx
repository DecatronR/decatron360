import React, { useState } from "react";
import { identityVerification } from "utils/api/verification/identityVerification";
import { useSnackbar } from "notistack";
import { X } from "lucide-react";

const IdentityVerificationForm = ({ onClose, onSuccess }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    nin: "",
    firstname: "",
    lastname: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userId = sessionStorage.getItem("userId");
      await identityVerification(userId, formData);
      enqueueSnackbar("Identity verification successful!", {
        variant: "success",
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          "Failed to verify identity. Please try again.",
        { variant: "error" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Verify Your Identity
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="nin"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              NIN Number
            </label>
            <input
              type="text"
              id="nin"
              name="nin"
              value={formData.nin}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your NIN"
              required
            />
          </div>

          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your first name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your last name"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-full hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify Identity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IdentityVerificationForm;
