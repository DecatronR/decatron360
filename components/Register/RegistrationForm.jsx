"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useSnackbar } from "notistack";
import { fetchRoles } from "../../utils/api/registration/fetchRoles";
import ButtonSpinner from "components/ui/ButtonSpinner";

const Registration = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    password: "",
    confirmpassword: "",
  });
  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    const handleFetchRoles = async () => {
      try {
        const res = await fetchRoles();
        setRoles(res);
      } catch (error) {
        enqueueSnackbar("Error fetching roles", error.message, {
          variant: "error ",
        });
      }
    };
    handleFetchRoles();
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsButtonLoading(true);
    setRegistrationSuccess(false); // Reset flag before starting

    try {
      const response = await axios.post(`${baseUrl}/auth/register`, formData);
      if (response.status === 201) {
        setRegistrationSuccess(true);
        sessionStorage.setItem("email", formData.email);
        sessionStorage.setItem("userId", response.data.user);
        enqueueSnackbar("Please complete OTP verification!", {
          variant: "success",
        });
        router.replace("/auth/otp");
        return;
      }
    } catch (error) {
      if (registrationSuccess) return;

      let errorMessage = "Registration failed";

      if (error.response) {
        const responseData = error.response.data;

        if (Array.isArray(responseData.responseMessage)) {
          errorMessage = responseData.responseMessage
            .map((msg) => msg.msg)
            .join(", ");
        } else if (typeof responseData.responseMessage === "string") {
          errorMessage = responseData.responseMessage;
        } else {
          errorMessage = responseData.message || "Something went wrong!";
        }
      } else if (error.request) {
        errorMessage = "No response from the server. Please try again.";
      } else {
        errorMessage = error.message;
      }

      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <div className="w-full max-w-md p-6 bg-white border border-gray-300 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-900">
          Sign up
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Join Decatron today
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <select
            id="role"
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option disabled value="">
              What best describes you
            </option>
            {roles.map((role) => (
              <option key={role.id} value={role.slug}>
                {role.roleName}
              </option>
            ))}
          </select>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-4 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-500" />
              ) : (
                <Eye className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
          <div className="relative">
            <input
              id="confirmpassword"
              name="confirmpassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="Confirm Password"
              value={formData.confirmpassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              onClick={toggleShowConfirmPassword}
              className="absolute inset-y-0 right-4 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-gray-500" />
              ) : (
                <Eye className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-primary-500 rounded-full hover:bg-primary-600"
          >
            {isButtonLoading ? <ButtonSpinner /> : "Sign up"}
          </button>
        </form>
        <div className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/auth/login" className="text-primary-500 hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default Registration;
