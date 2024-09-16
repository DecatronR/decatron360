"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Registration = () => {
  const router = useRouter();
  // State for form data and error messages
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "08063247818",
    password: "",
    confirmpassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [inspectionData, setInspectionData] = useState(null);

  // Handle changes in form fields
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Toggle visibility for password fields
  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const onRegistration = async () => {
    try {
      console.log("form data", formData);
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        formData
      );

      if (response.status === 201) {
        setSuccess("Registration successful! You can now login.");
        console.log("Registration successful", response);
      } else {
        setError("Registration failed. Please try again.");
        console.log("Registration failed", response);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("An error occurred during registration. Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear previous error messages
    setError(null);
    setSuccess(null);
    sessionStorage.setItem("email", formData.email);
    sessionStorage.setItem("password", formData.password);
    onRegistration();
    router.replace("/auth/otp");
  };

  const handleLoginClick = (event) => {
    event.preventDefault();
    console.log("reg button clicked");
    router.replace("/auth/login");
  };

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("inspectionData"));
    console.log("inspection data", data);
    setInspectionData(data);
    setFormData((prevState) => ({
      name: prevState.name || data.name || "",
      email: prevState.email || data.email || "",
      role: prevState.role || data.role || "",
      phone: prevState.phone || data.phone || "08063247818",
      password: prevState.password || "",
      confirmpassword: prevState.confirmpassword || "",
    }));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Create Your Account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
            >
              {/* we need to fetch roles dynamically from the backend */}
              <option value="buyer">Buyer/Renter</option>
              <option value="agent">Agent</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmpassword"
                name="confirmpassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.confirmpassword}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
              />
              <button
                type="button"
                onClick={toggleShowConfirmPassword}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-500 border border-transparent rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
            >
              Sign up
            </button>
          </div>
        </form>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}
        <div className="flex items-center justify-between">
          <span className="border-t border-gray-300 w-1/3" />
          <span className="text-sm text-gray-500">Or sign up with</span>
          <span className="border-t border-gray-300 w-1/3" />
        </div>
        <div>
          <button
            type="button"
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2C7.03 4 3 8.03 3 13s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm-2 3h1v7h-1zm1 8v1H9v-1zm0-8h1v1h-1zm1-1v1h-1v-1zm0 2h1v1h-1zm-1-1v1H9v-1zm0 2h1v1h-1zm1 1h-1v1h1z" />
            </svg>
            Sign in with Google
          </button>
        </div>
        <div className="flex items-center justify-center text-sm">
          <span className="text-gray-500">Already have an account?</span>
          <button
            onClick={handleLoginClick}
            className="text-primary-500 hover:underline"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;
