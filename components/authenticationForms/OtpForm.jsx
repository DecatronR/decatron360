"use client";
import React, { useState } from "react";
import axios from "axios";

const OtpForm = ({ email, onCloseOtp }) => {
  const [otp, setOtp] = useState("");

  const handleChange = (event) => {
    setOtp(event.target.value);
  };

  const handleResendOtp = async () => {
    try {
      const res = await axios.get("http://localhost:8080/auth/resendOTP");
      console.log("OTP resent", res.data);
    } catch (error) {
      console.log("Error resending OTP", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (otp.length === 6) {
      try {
        const res = await axios.post(
          "http://localhost:8080/auth/confirmOTP",
          { email: email, otp: otp },
          { withCredentials: true }
        );
        console.log("OTP confirmed", res.data);
      } catch (error) {
        console.log("Error confirming OTP", error);
      }
      onCloseOtp();
    } else {
      console.error("OTP should be 6 digits long");
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
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              OTP Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              maxLength={6}
              autoComplete="one-time-code"
              required
              value={otp}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
            />
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
            onClick={onResendOtp}
            className="font-medium text-primary-500 hover:text-primary-400"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpForm;
