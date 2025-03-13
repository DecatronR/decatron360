"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import ButtonSpinner from "components/ui/ButtonSpinner";
import Image from "next/image";

const LoginForm = () => {
  const { signIn } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsButtonLoading(true);
    try {
      await signIn(formData.email, formData.password);
      enqueueSnackbar("Login successful!", { variant: "success" });
      router.replace("/");
    } catch (error) {
      enqueueSnackbar("Login failed. Please check your credentials.", {
        variant: "error",
      });
    } finally {
      setIsButtonLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <div className="w-full max-w-md p-6 bg-white border border-gray-300 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-900">
          Sign in
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Welcome back to Decatron
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[primary-500]"
            />
          </div>
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
          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-primary-500 rounded-full hover:bg-primary-600"
          >
            {isButtonLoading ? <ButtonSpinner /> : "Sign in"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a href="/auth/register" className="text-primary-500 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
