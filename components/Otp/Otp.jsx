"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "notistack";
import { fetchUserData } from "utils/api/user/fetchUserData";
import ButtonSpinner from "components/ui/ButtonSpinner";

const Otp = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { signIn, setUser } = useAuth();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [email, setEmail] = useState("");
  const inputRefs = useRef([]);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const email = sessionStorage.getItem("email");

    if (email) {
      setEmail(email);
    }
  }, []);

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData
      .getData("text")
      .trim()
      .replace(/[^0-9]/g, "");

    if (pastedData.length !== 6) return;

    setOtp(pastedData.split(""));

    // Automatically focus each input field
    pastedData.split("").forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
        }
      }
    });
  };

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
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
    if (isResending) return; // Prevent multiple clicks

    setIsResending(true);
    try {
      const response = await axios.post(`${baseUrl}/auth/resendOTP`, { email });
      if (response.status === 200) {
        enqueueSnackbar("OTP resent successfully!", { variant: "success" });
        // Clear the OTP input fields
        setOtp(new Array(6).fill(""));
      }
    } catch (error) {
      let errorMessage = "Failed to resend OTP";
      if (error.response?.data?.responseMessage) {
        errorMessage = Array.isArray(error.response.data.responseMessage)
          ? error.response.data.responseMessage[0].msg
          : error.response.data.responseMessage;
      }
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setIsResending(false);
    }
  };

  const onConfirmOtp = async () => {
    const otpValue = otp.join("");

    // Validate OTP before making the API call
    if (!otpValue || otpValue.length !== 6) {
      throw new Error("Please enter a valid 6-digit OTP");
    }

    try {
      const res = await axios.post(
        `${baseUrl}/auth/confirmOTP`,
        { email: email, otp: otpValue },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        const { responseMessage } = error.response.data;
        if (Array.isArray(responseMessage) && responseMessage.length > 0) {
          throw new Error(responseMessage[0].msg || "Failed to verify OTP");
        }
      }
      throw new Error("Failed to verify OTP. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prevent multiple submissions
    if (isVerifying) return;

    setIsVerifying(true);
    try {
      setError(null);
      setSuccess(null);

      const response = await onConfirmOtp();
      enqueueSnackbar("OTP verified successfully!", { variant: "success" });

      const userId = response?.user || sessionStorage.getItem("userId");
      const token = response?.token;

      if (!userId) {
        enqueueSnackbar("Failed to retrieve user ID!", { variant: "error" });
        return;
      }

      if (!token) {
        enqueueSnackbar("Authentication failed: No token received!", {
          variant: "error",
        });
        return;
      }

      // Fetch user data to update AuthContext
      const userData = await fetchUserData(userId);
      setUser(userData);

      sessionStorage.setItem("userId", userData.id);
      sessionStorage.setItem("token", token);

      // Redirect user after updating state
      const queryParams = new URLSearchParams(window.location.search);
      const redirectPath = queryParams.get("redirect") || "/";
      router.replace(redirectPath);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setIsVerifying(false);
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
                onPaste={handlePaste}
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
              disabled={isVerifying}
              className={`flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-500 border border-transparent rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 ${
                isVerifying ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isVerifying ? <ButtonSpinner /> : "Verify OTP"}
            </button>
          </div>
        </form>
        <div className="text-sm text-center text-gray-500">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResending}
            className={`font-medium text-primary-500 hover:text-primary-400 ${
              isResending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Otp;
