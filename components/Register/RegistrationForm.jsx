"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useSnackbar } from "notistack";
import { fetchRoles } from "../../utils/api/registration/fetchRoles";
import ButtonSpinner from "components/ButtonSpinner";

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
  const [inspectionData, setInspectionData] = useState(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    const handleFetchRoles = async () => {
      try {
        const res = await fetchRoles();
        setRoles(res);
      } catch (error) {
        console.log("");
      }
    };
    handleFetchRoles();
  }, []);

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("inspectionData"));
    setInspectionData(data);
    setFormData((prevState) => ({
      name: prevState.name || data?.name || "",
      email: prevState.email || data?.email || "",
      role: prevState.role || data?.role || "",
      phone: prevState.phone || data?.phone || "",
      password: prevState.password || "",
      confirmpassword: prevState.confirmpassword || "",
    }));
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const onRegistration = async () => {
    try {
      const response = await axios.post(`${baseUrl}/auth/register`, formData);

      if (response.status === 201) {
        enqueueSnackbar("Please complete OTP verification!", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(`Registration failed`, {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar(`Registration failed: ${error.message}`, {
        variant: "error",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsButtonLoading(true);

    sessionStorage.setItem("email", formData.email);
    sessionStorage.setItem("password", formData.password);
    onRegistration();
    router.replace("/auth/otp");
    setIsButtonLoading(false);
  };

  const handleLoginClick = (event) => {
    event.preventDefault();
    router.replace("/auth/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Create Your Account
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Two-column section for Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-primary-400 focus:border-primary-400"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-primary-400 focus:border-primary-400"
              />
            </div>
          </div>

          {/* Role and Phone fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-primary-400 focus:border-primary-400"
              >
                <option disabled value="">
                  Select Role
                </option>
                {roles &&
                  roles.map((role) => (
                    <option key={role.id} value={role.slug}>
                      {role.roleName}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="phone"
                autoComplete="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-primary-400 focus:border-primary-400"
              />
            </div>
          </div>

          {/* Password and Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-primary-400 focus:border-primary-400"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 flex items-center px-3"
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
                htmlFor="confirmpassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmpassword"
                  name="confirmpassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmpassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-primary-400 focus:border-primary-400"
                />
                <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md shadow-sm hover:bg-primary-600"
          >
            Sign up
          </button>
        </form>
        <div className="mt-4 text-sm text-center text-gray-500">
          Already have an account?{" "}
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
