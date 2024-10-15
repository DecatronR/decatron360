"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "notistack";

const Otp = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { signIn } = useAuth();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const password = sessionStorage.getItem("password");

    if (email && password) {
      setEmail(email);
      setPassword(password);
    }
  }, []);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, ""); // only allow digits
    if (value) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });

      // Move to next input if available
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    } else {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = "";
        return newOtp;
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await axios.get("http://localhost:8080/auth/resendOTP");
      console.log("OTP resent", res.data);
    } catch (error) {
      console.log("Error resending OTP", error);
    }
  };

  const onConfirmOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      try {
        const res = await axios.post(
          "http://localhost:8080/auth/confirmOTP",
          { email: email, otp: otpValue },
          { withCredentials: true }
        );
        console.log("OTP confirmed", res.data);
      } catch (error) {
        console.log("Error confirming OTP", error);
      }
    } else {
      console.error("OTP should be 6 digits long");
    }
  };

  const onLogin = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Clear previous error messages
      setError(null);
      setSuccess(null);

      await onConfirmOtp();
      enqueueSnackbar("Registration successful!", { variant: "success" });
      await onLogin();
      const queryParams = new URLSearchParams(window.location.search);
      const redirectPath = queryParams.get("redirect") || "/";

      // Redirect to the path specified in the query parameter or default to home
      router.replace(redirectPath);
    } catch (error) {
      enqueueSnackbar("Failed to complete OTP verification!", {
        variant: "error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Enter OTP
        </h2>
        <p className="text-sm text-center text-gray-500">
          We've sent an OTP to your email.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-10 h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-primary-400 focus:border-primary-400"
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    !digit &&
                    inputRefs.current[index - 1]
                  ) {
                    inputRefs.current[index - 1].focus();
                  }
                }}
              />
            ))}
          </div>
          <div>
            <button
              type="submit"
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-500 border border-transparent rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
            >
              Verify OTP
            </button>
          </div>
        </form>
        <div className="text-sm text-center text-gray-500">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResendOtp}
            className="font-medium text-primary-500 hover:text-primary-400"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default Otp;
