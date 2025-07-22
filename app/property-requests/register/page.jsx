"use client";
import React, { useState } from "react";

const STATES = [
  { name: "Lagos", lgas: ["Ikeja", "Lekki", "Yaba", "Surulere"] },
  { name: "Abuja", lgas: ["Garki", "Wuse", "Maitama", "Asokoro"] },
  { name: "Rivers", lgas: ["Port Harcourt", "Obio-Akpor", "Bonny"] },
  // Add more states and LGAs as needed
];

const LISTING_TYPES = ["For Rent", "For Sale", "Shortlet"];

const steps = [
  "Personal Info",
  "Coverage Area",
  "Listing Preferences",
  "Account Security",
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

  // Helper for multi-select
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

  // Filter LGAs based on selected states
  const availableLGAs = STATES.filter((s) =>
    form.states.includes(s.name)
  ).flatMap((s) => s.lgas);

  // Validation per step - reordered to match new step sequence
  const validateStep = () => {
    let err = {};
    if (step === 0) {
      // Personal Info
      if (!form.fullName) err.fullName = "Full name is required";
      if (!form.email) err.email = "Email is required";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
        err.email = "Invalid email";
      if (!form.phone) err.phone = "Phone number is required";
    } else if (step === 1) {
      // Coverage Area
      if (form.states.length === 0) err.states = "Select at least one state";
      if (form.lgas.length === 0) err.lgas = "Select at least one LGA";
    } else if (step === 2) {
      // Listing Preferences
      if (form.listingTypes.length === 0)
        err.listingTypes = "Select at least one listing type";
    } else if (step === 3) {
      // Account Security (Password - now last)
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      // TODO: Submit form data to backend
      alert("Registration complete! (No backend integration yet)");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((label, idx) => (
            <React.Fragment key={label}>
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  idx === step
                    ? "border-primary-600 bg-primary-600 text-white"
                    : idx < step
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 bg-white text-gray-400"
                } font-bold transition-all`}
              >
                {idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-1 bg-gray-200 mx-2 rounded" />
              )}
            </React.Fragment>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {steps[step]}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Step 0: Personal Info */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Coverage Area (moved from step 2) */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  States Covered
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {STATES.map((state) => (
                    <button
                      type="button"
                      key={state.name}
                      className={`px-4 py-2 rounded-full border transition-all ${
                        form.states.includes(state.name)
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        toggleMultiSelect("states", state.name);
                        // Remove LGAs not in selected states
                        setForm((prev) => ({
                          ...prev,
                          lgas: prev.lgas.filter((lga) =>
                            STATES.filter(
                              (s) =>
                                prev.states.includes(s.name) ||
                                state.name === s.name
                            )
                              .flatMap((s) => s.lgas)
                              .includes(lga)
                          ),
                        }));
                      }}
                    >
                      {state.name}
                    </button>
                  ))}
                </div>
                {errors.states && (
                  <p className="text-red-500 text-xs mt-1">{errors.states}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Local Governments Covered
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableLGAs.map((lga) => (
                    <button
                      type="button"
                      key={lga}
                      className={`px-4 py-2 rounded-full border transition-all ${
                        form.lgas.includes(lga)
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                      onClick={() => toggleMultiSelect("lgas", lga)}
                    >
                      {lga}
                    </button>
                  ))}
                </div>
                {errors.lgas && (
                  <p className="text-red-500 text-xs mt-1">{errors.lgas}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Listing Preferences (moved from step 3) */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Types of Listings Interested In
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {LISTING_TYPES.map((type) => (
                    <button
                      type="button"
                      key={type}
                      className={`px-4 py-2 rounded-full border transition-all ${
                        form.listingTypes.includes(type)
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                      onClick={() => toggleMultiSelect("listingTypes", type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {errors.listingTypes && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.listingTypes}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Account Security (Password - now last) */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Summary of previous steps */}
              <div className="bg-gray-50 rounded-xl p-4 mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">
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
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all"
              >
                Complete Registration
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
