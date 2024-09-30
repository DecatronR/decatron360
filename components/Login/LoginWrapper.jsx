"use client";

import React from "react";
import LoginForm from "./LoginForm";
import LoginActions from "./LoginActions";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

const LoginWrapper = () => {
  const { signIn } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleLogin = async (formData) => {
    try {
      const res = await signIn(formData.email, formData.password);
      console.log("login response", res);

      // Show success snackbar upon successful login
      enqueueSnackbar("Login successful!", { variant: "success" });

      // Extract redirect path from query parameters
      const queryParams = new URLSearchParams(window.location.search);
      const redirectPath = queryParams.get("redirect") || "/";

      // Redirect to the path specified in the query parameter or default to home
      router.replace(redirectPath);
    } catch (error) {
      console.error("Issues with login", error);
      enqueueSnackbar("Failed to login. Please check your credentials.", {
        variant: "error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Login to Your Account
        </h2>
        <LoginForm onSubmit={handleLogin} />
        <LoginActions />
      </div>
    </div>
  );
};

export default LoginWrapper;
