"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  MapPin,
  Heart,
  Shield,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  Lock,
} from "lucide-react";
import { fetchStates } from "@/utils/api/location/fetchStates";
import { fetchListingTypes } from "@/utils/api/listing/fetchListingTypes";
import { fetchLGAsByStateId } from "@/utils/api/location/fetchLGAsByStateId";

const steps = [
  {
    title: "Personal Info",
    subtitle: "Tell us about yourself",
    icon: User,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Coverage Area",
    subtitle: "Where do you operate?",
    icon: MapPin,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Listing Preferences",
    subtitle: "What interests you?",
    icon: Heart,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Account Security",
    subtitle: "Secure your account",
    icon: Shield,
    color: "text-primary-600",
    bgColor: "bg-primary-100",
  },
];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  states: [],
  lgas: [],
  listingTypes: [],
};

function RegisterPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [listingTypes, setListingTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [availableLGAs, setAvailableLGAs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [statesData, listingTypesData] = await Promise.all([
          fetchStates(),
          fetchListingTypes(),
        ]);

        // Handle the API response structure: {responseCode, responseMessage, data}
        const states = statesData?.data || statesData || [];
        const listingTypes = listingTypesData?.data || listingTypesData || [];

        setStates(states);
        setListingTypes(listingTypes);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchLGAsForSelectedStates = async (selectedStateIds) => {
    try {
      const lgaPromises = selectedStateIds.map((stateId) =>
        fetchLGAsByStateId(stateId)
      );
      const lgaResults = await Promise.all(lgaPromises);

      // Extract data from the API response structure
      const allLGAs = lgaResults
        .flatMap((response) => {
          // Handle the API response structure: {responseCode, responseMessage, data}
          const lgaData = response.data || response;
          return Array.isArray(lgaData) ? lgaData : [];
        })
        .map((lga) => lga.lga || lga);

      // Remove duplicates and filter out any undefined values
      const uniqueLGAs = [...new Set(allLGAs)].filter(Boolean);
      setAvailableLGAs(uniqueLGAs);
    } catch (error) {
      console.error("Failed to fetch LGAs for selected states:", error);
      setAvailableLGAs([]);
    }
  };

  const toggleMultiSelect = (field, value) => {
    setForm((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  const handleStateToggle = async (stateName, stateId) => {
    const isSelected = form.states.includes(stateName);
    const updatedStates = isSelected
      ? form.states.filter((s) => s !== stateName)
      : [...form.states, stateName];

    // Update the form
    setForm((prev) => ({
      ...prev,
      states: updatedStates,
      lgas: [], // Reset LGAs when states change
    }));

    // Get state IDs of currently selected states
    const selectedStateIds = states
      .filter((s) => updatedStates.includes(s.state))
      .map((s) => s._id);

    // Fetch LGAs for selected states
    await fetchLGAsForSelectedStates(selectedStateIds);
  };

  const validateStep = () => {
    let err = {};
    if (step === 0) {
      if (!form.fullName) err.fullName = "Full name is required";
      if (!form.email) err.email = "Email is required";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
        err.email = "Invalid email address";
      if (!form.phone) err.phone = "Phone number is required";
    } else if (step === 1) {
      if (form.states.length === 0) err.states = "Select at least one state";
      if (form.lgas.length === 0) err.lgas = "Select at least one LGA";
    } else if (step === 2) {
      if (form.listingTypes.length === 0)
        err.listingTypes = "Select at least one listing type";
    } else if (step === 3) {
      if (!form.password) err.password = "Password is required";
      if (form.password.length < 6)
        err.password = "Password must be at least 6 characters";
      if (form.password !== form.confirmPassword)
        err.confirmPassword = "Passwords do not match";
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

  const handleSubmit = () => {
    if (validateStep()) {
      alert("Registration complete! Redirecting to OTP verification...");
    }
  };

  const currentStep = steps[step];
  const StepIcon = currentStep.icon;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with Icon */}
        <div className={`${currentStep.bgColor} p-8 text-center relative`}>
          {step > 0 && (
            <button
              onClick={handleBack}
              className="absolute top-6 left-6 p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div
            className={`w-16 h-16 ${currentStep.bgColor} border-4 border-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
          >
            <StepIcon className={`w-8 h-8 ${currentStep.color}`} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStep.title}
          </h2>
          <p className="text-gray-600">{currentStep.subtitle}</p>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-gray-50">
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
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 bg-white transition-all duration-300 ${
                    idx === step
                      ? "border-primary-600 text-primary-600 shadow-md scale-110"
                      : idx < step
                      ? "border-green-500 bg-green-500 text-white shadow-sm"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {idx < step ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="font-bold text-xs">{idx + 1}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              Step {step + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {/* Step 0: Personal Info */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                      errors.fullName
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="Enter your full name"
                    autoFocus
                  />
                </div>
                {errors.fullName && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">
                      {errors.fullName}
                    </p>
                  </div>
                )}
              </div>

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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                      errors.phone
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="+234 800 000 0000"
                  />
                </div>
                {errors.phone && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">
                      {errors.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Coverage Area */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select States You Cover
                </label>
                <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-xl">
                  {states.map((state) => (
                    <button
                      key={state._id}
                      type="button"
                      className={`p-4 rounded-xl border-2 text-center transition-all duration-300 transform hover:scale-105 ${
                        form.states.includes(state.state)
                          ? "border-primary-600 bg-primary-50 text-primary-700 shadow-lg"
                          : "border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50 text-gray-700"
                      }`}
                      onClick={() => handleStateToggle(state.state, state._id)}
                    >
                      <div className="font-semibold">{state.state}</div>
                    </button>
                  ))}
                </div>
                {errors.states && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm font-medium text-center">
                      {errors.states}
                    </p>
                  </div>
                )}
              </div>

              {form.states.length > 0 && availableLGAs.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Local Government Areas
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-xl">
                    {availableLGAs.map((lga) => (
                      <button
                        key={lga}
                        type="button"
                        className={`p-3 rounded-lg border text-sm transition-all duration-200 ${
                          form.lgas.includes(lga)
                            ? "border-primary-600 bg-primary-50 text-primary-700"
                            : "border-gray-200 bg-white hover:border-primary-300 text-gray-700"
                        }`}
                        onClick={() => toggleMultiSelect("lgas", lga)}
                      >
                        {lga}
                      </button>
                    ))}
                  </div>
                  {errors.lgas && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-sm font-medium text-center">
                        {errors.lgas}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {form.states.length > 0 && availableLGAs.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">Loading LGAs...</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Listing Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Types of Properties You're Interested In
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {listingTypes.map((type) => (
                    <button
                      key={type._id}
                      type="button"
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
                        form.listingTypes.includes(type.listingType)
                          ? "border-primary-600 bg-primary-50 text-primary-700 shadow-lg"
                          : "border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50 text-gray-700"
                      }`}
                      onClick={() =>
                        toggleMultiSelect("listingTypes", type.listingType)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          {type.listingType}
                        </span>
                        {form.listingTypes.includes(type.listingType) && (
                          <CheckCircle className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.listingTypes && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm font-medium text-center">
                      {errors.listingTypes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Account Security */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3  border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                      errors.password
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="Create a secure password"
                  />
                </div>
                {errors.password && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">
                      {errors.password}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                      errors.confirmPassword
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">
                      {errors.confirmPassword}
                    </p>
                  </div>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">
                  Password Requirements:
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        form.password.length >= 6
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    At least 6 characters long
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        form.password === form.confirmPassword && form.password
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    Passwords match
                  </div>
                </div>
              </div>

              {/* Registration Summary */}
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-4 border border-primary-200">
                <h4 className="font-bold text-gray-800 mb-3">
                  Registration Summary
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Name:</span> {form.fullName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {form.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {form.phone}
                  </p>
                  <p>
                    <span className="font-medium">States:</span>{" "}
                    {form.states.join(", ")}
                  </p>
                  <p>
                    <span className="font-medium">LGAs:</span>{" "}
                    {form.lgas.join(", ")}
                  </p>
                  <p>
                    <span className="font-medium">Listing Types:</span>{" "}
                    {form.listingTypes.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            <div>
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
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
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Complete Registration
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="px-8 pb-8">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500">
              Need help?{" "}
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                Contact Support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
