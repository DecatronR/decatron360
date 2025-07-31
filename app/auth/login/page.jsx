"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "notistack";
import { useRouter, useSearchParams } from "next/navigation";
import { requestAndSendNotificationPermission } from "@/utils/api/pushNotification/requestPermission";

const steps = [
  {
    title: "Welcome Back",
    subtitle: "Sign in to your account",
    icon: User,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Account Security",
    subtitle: "Verify your credentials",
    icon: Shield,
    color: "text-primary-600",
    bgColor: "bg-primary-100",
  },
];

const initialForm = {
  email: "",
  password: "",
};

function LoginPage() {
  const { signIn } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasInspectionData, setHasInspectionData] = useState(false);

  useEffect(() => {
    // Check if there's inspection form data in sessionStorage
    const inspectionFormData = sessionStorage.getItem("inspectionFormData");
    if (inspectionFormData) {
      try {
        const parsedData = JSON.parse(inspectionFormData);
        setForm((prev) => ({
          ...prev,
          email: parsedData.email || "",
        }));
        setHasInspectionData(true);
      } catch (error) {
        console.error("Error parsing inspection form data:", error);
      }
    }
  }, []);

  const validateStep = () => {
    let err = {};
    if (step === 0) {
      if (!form.email) err.email = "Email is required";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
        err.email = "Invalid email address";
    } else if (step === 1) {
      if (!form.password) err.password = "Password is required";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);

      const user = await signIn(form.email, form.password);
      console.log("User data on login: ", user);
      enqueueSnackbar("Login successful!", { variant: "success" });

      // Trigger notification request
      if (user?.id) {
        await requestAndSendNotificationPermission(user.id);
      }

      // Redirect to intended page or home
      const redirectPath = searchParams.get("redirect") || "/";
      router.replace(redirectPath);
    } catch (error) {
      // Check if the error is due to unverified account
      if (
        error.response?.data?.responseCode === 410 &&
        error.response?.data?.responseMessage ===
          "Kindly confirm your account to proceed"
      ) {
        // Store email in session storage for OTP page
        sessionStorage.setItem("propertyRequestEmail", form.email);
        enqueueSnackbar("Please verify your account first", {
          variant: "info",
        });
        router.replace("/property-requests/otp");
      } else {
        enqueueSnackbar("Login failed. Please check your credentials.", {
          variant: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const currentStep = steps[step];
  const StepIcon = currentStep.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-4">
      <div className="w-full max-w-lg sm:max-w-md bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header with Icon */}
        <div className={`${currentStep.bgColor} p-4 text-center relative`}>
          {step > 0 && (
            <button
              onClick={handleBack}
              className="absolute top-3 left-3 p-1.5 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          <div
            className={`w-10 h-10 ${currentStep.bgColor} border-2 border-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md`}
          >
            <StepIcon className={`w-5 h-5 ${currentStep.color}`} />
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-1">
            {currentStep.title}
          </h2>
          <p className="text-sm text-gray-600">{currentStep.subtitle}</p>
        </div>

        {/* Progress Indicator */}
        <div className="px-4 py-3 bg-gray-50">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 rounded-full">
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>

            {steps.map((stepItem, idx) => (
              <div key={stepItem.title} className="relative z-10">
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full border-2 bg-white transition-all duration-300 ${
                    idx === step
                      ? "border-primary-600 text-primary-600 shadow-md scale-110"
                      : idx < step
                      ? "border-green-500 bg-green-500 text-white shadow-sm"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {idx < step ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <span className="font-bold text-xs">{idx + 1}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              Step {step + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 sm:p-8">
            {/* Step 0: Email */}
            {step === 0 && (
              <div className="space-y-6">
                {hasInspectionData && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-sm text-blue-800 text-center">
                      Complete your inspection booking by signing in to your
                      account
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                        errors.email
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                      placeholder="your.email@example.com"
                      autoFocus
                    />
                  </div>
                  {errors.email && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm font-medium">
                        {errors.email}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-4 border border-primary-200">
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">
                    Ready to continue?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Enter your email address to proceed to the secure login
                    step.
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Password */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                        errors.password
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                      placeholder="Enter your password"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm font-medium">
                        {errors.password}
                      </p>
                    </div>
                  )}
                </div>

                {/* Login Summary */}
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-4 border border-primary-200">
                  <h4 className="font-bold text-gray-800 mb-3">
                    Sign In Summary
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Email:</span> {form.email}
                    </p>
                    <p>
                      <span className="font-medium">Password:</span>{" "}
                      {form.password ? "••••••••" : "Not entered"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons - Fixed at bottom */}
        <div className="border-t border-gray-100 bg-white p-6">
          <div className="flex justify-between items-center">
            <div>
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>
              )}
            </div>

            {step < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex items-center gap-2 px-8 py-3 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary-600 hover:bg-primary-700 text-white"
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Don't have an account?{" "}
                <a
                  href="/property-requests/register"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
