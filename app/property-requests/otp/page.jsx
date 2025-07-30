"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { CheckCircle, RefreshCw, ArrowLeft, Shield, Mail } from "lucide-react";
import ButtonSpinner from "@/components/ui/ButtonSpinner";
import { useAuth } from "@/context/AuthContext";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import axios from "axios";

function OTPVerificationPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { setUser } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    // Get email from sessionStorage (set during registration)
    const storedEmail = sessionStorage.getItem("propertyRequestEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email found, redirect back to registration
      enqueueSnackbar("No registration data found. Please register again.", {
        variant: "error",
      });
      router.push("/property-requests/register");
    }
  }, [router, enqueueSnackbar]);

  useEffect(() => {
    // Countdown timer
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }

      // Auto-submit when all 6 digits are entered
      if (newOtp.every((digit) => digit !== "") && !isLoading) {
        handleVerifyOtp(newOtp.join(""));
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      setError("");
      handleVerifyOtp(pastedData);
    }
  };

  const handleVerifyOtp = async (otpCode) => {
    if (!email) {
      enqueueSnackbar("No email found. Please register again.", {
        variant: "error",
      });
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${baseUrl}/auth/confirmOTP`,
        { email: email, otp: otpCode },
        { withCredentials: true }
      );

      console.log("OTP Response before:", res);
      const response = res.data;
      console.log("OTP Response after:", response);

      // Show success message immediately
      enqueueSnackbar("OTP verified successfully! Welcome to Decatron!", {
        variant: "success",
      });

      // Store authentication data for automatic login
      if (response.token) {
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("authToken", response.token);
      }
      if (response.user) {
        sessionStorage.setItem("userId", response.user);
      }

      // Clear property request email from session storage
      sessionStorage.removeItem("propertyRequestEmail");

      // Set verified state
      setIsVerified(true);

      // Fetch and set user data in AuthContext (separate try-catch to not break main flow)
      if (response.user) {
        fetchUserData(response.user)
          .then((userData) => {
            setUser(userData);
          })
          .catch((error) => {
            console.error("Failed to fetch user data:", error);
          });
      }

      // Redirect to home page after success
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      let errorMessage = "Verification failed. Please try again.";

      if (err.response?.data?.responseMessage) {
        errorMessage = Array.isArray(err.response.data.responseMessage)
          ? err.response.data.responseMessage[0].msg
          : err.response.data.responseMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timeLeft > 0 || !email) return;

    setIsResending(true);
    setError("");

    try {
      const response = await axios.post(`${baseUrl}/auth/resendOTP`, { email });
      if (response.status === 200) {
        enqueueSnackbar("New OTP sent to your email!", {
          variant: "success",
        });
        setTimeLeft(300); // Reset timer
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (err) {
      let errorMessage = "Failed to resend OTP. Please try again.";

      if (err.response?.data?.responseMessage) {
        errorMessage = Array.isArray(err.response.data.responseMessage)
          ? err.response.data.responseMessage[0].msg
          : err.response.data.responseMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    // Navigate back to registration
    router.push("/property-requests/register");
  };

  const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3") : "";

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Registration Complete!
          </h2>
          <p className="text-gray-600 mb-6">
            Your account has been successfully verified. Welcome to Decatron!
          </p>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-green-800">
              You're now logged in and will be redirected to the home page
              shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleBack}
            className="absolute top-6 left-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600 text-sm">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-primary-600 font-semibold">{maskedEmail}</p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <div className="flex gap-3 justify-center mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all ${
                  error
                    ? "border-red-300 bg-red-50"
                    : digit
                    ? "border-primary-300 bg-primary-50"
                    : "border-gray-300 bg-white"
                } ${isLoading ? "opacity-50" : ""}`}
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p className="text-red-600 text-sm text-center font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-primary-600 mb-4">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Verifying...</span>
            </div>
          )}
        </div>

        {/* Timer and Resend */}
        <div className="text-center mb-6">
          {timeLeft > 0 ? (
            <p className="text-gray-600 text-sm">
              Code expires in{" "}
              <span className="font-semibold text-primary-600">
                {formatTime(timeLeft)}
              </span>
            </p>
          ) : (
            <p className="text-gray-600 text-sm mb-3">
              Didn't receive the code?
            </p>
          )}

          <button
            onClick={handleResendOtp}
            disabled={timeLeft > 0 || isResending}
            className={`text-sm font-semibold transition-all ${
              timeLeft > 0 || isResending
                ? "text-gray-400 cursor-not-allowed"
                : "text-primary-600 hover:text-primary-700 hover:underline"
            }`}
          >
            {isResending ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Resending...
              </span>
            ) : (
              "Resend Code"
            )}
          </button>
        </div>

        {/* Manual Verify Button (for when auto-submit fails) */}
        {otp.every((digit) => digit !== "") && !isLoading && (
          <button
            onClick={() => handleVerifyOtp(otp.join(""))}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Verify Account
          </button>
        )}

        {/* Help Text */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Having trouble?
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• Wait a few minutes for the email to arrive</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Still need help?{" "}
            <a
              href="mailto:contact@decatron.com.ng"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OTPVerificationPage;
