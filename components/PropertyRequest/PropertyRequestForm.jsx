"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { createPropertyRequest } from "@/utils/api/propertyRequest/createPropertyRequest";
import { fetchListingTypes } from "utils/api/propertyListing/fetchListingTypes";
import { fetchPropertyTypes } from "@/utils/api/propertyListing/fetchPropertyTypes";
import { fetchPropertyUsage } from "@/utils/api/propertyListing/fetchPropertyUsage";
import { fetchStates } from "@/utils/api/propertyListing/fetchStates";
import { fetchLga } from "@/utils/api/propertyListing/fetchLga";
import { fetchRoles } from "../../utils/api/registration/fetchRoles";
import Spinner from "@/components/ui/Spinner";
import Swal from "sweetalert2";
import {
  Search,
  MapPin,
  Home,
  DollarSign,
  User,
  Mail,
  Phone,
} from "lucide-react";

const PropertyRequestForm = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    category: "",
    propertyType: "",
    propertyUsage: "",
    minBudget: "",
    maxBudget: "",
    state: "",
    lga: "",
    neighbourhood: "",
    note: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data for dropdowns
  const [listingTypes, setListingTypes] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [propertyUsages, setPropertyUsages] = useState([]);
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [roles, setRoles] = useState([]);

  // Determine if we should show user details section
  const hasUserData =
    user && user.name && user.email && user.phone && user.role;

  useEffect(() => {
    // Pre-fill user data if logged in
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
      }));
    }

    const fetchData = async () => {
      try {
        const [
          listingTypesData,
          propertyTypesData,
          propertyUsagesData,
          statesData,
        ] = await Promise.all([
          fetchListingTypes(),
          fetchPropertyTypes(),
          fetchPropertyUsage(),
          fetchStates(),
        ]);

        // Log the fetched data here
        console.log("Fetched listing types:", listingTypesData);
        console.log("Fetched property types:", propertyTypesData);
        console.log("Fetched property usages:", propertyUsagesData);
        console.log("Fetched states:", statesData);

        setListingTypes(listingTypesData);
        setPropertyTypes(propertyTypesData);
        setPropertyUsages(propertyUsagesData);
        setStates(statesData);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchLgasForState = async () => {
      if (formData.state) {
        try {
          const lgaData = await fetchLga(formData.state);
          setLgas(lgaData);
        } catch (error) {
          console.error("Failed to fetch LGAs:", error);
          setLgas([]);
        }
      } else {
        setLgas([]);
      }
    };
    fetchLgasForState();
  }, [formData.state]);

  useEffect(() => {
    // Fetch roles dynamically
    const getRoles = async () => {
      try {
        const fetchedRoles = await fetchRoles();
        if (Array.isArray(fetchedRoles) && fetchedRoles.length > 0) {
          setRoles(fetchedRoles);
        }
      } catch (error) {
        // fallback to static roles already in state
      }
    };
    getRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      name: hasUserData ? user.name : formData.name,
      email: hasUserData ? user.email : formData.email,
      phone: hasUserData ? user.phone : formData.phone,
      role: hasUserData ? user.role : formData.role,
    };
    // Convert minBudget and maxBudget to numbers if present
    if (payload.minBudget) payload.minBudget = Number(payload.minBudget);
    if (payload.maxBudget) payload.maxBudget = Number(payload.maxBudget);
    setIsSubmitting(true);
    try {
      await createPropertyRequest(payload);
      enqueueSnackbar("Property request submitted successfully!", {
        variant: "success",
      });

      // Show SweetAlert2 confirmation dialog
      const result = await Swal.fire({
        title: "Property Request Submitted! 🎉",
        text: "Your property request has been successfully submitted. What would you like to do next?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "View Other Requests",
        cancelButtonText: "Submit Another Request",
        confirmButtonColor: "#3B82F6",
        cancelButtonColor: "#10B981",
        reverseButtons: true,
        customClass: {
          popup: "rounded-2xl",
          title: "text-xl font-semibold text-gray-900",
          content: "text-gray-600",
          confirmButton: "rounded-xl px-6 py-3 font-medium",
          cancelButton: "rounded-xl px-6 py-3 font-medium",
        },
      });

      if (result.isConfirmed) {
        // User clicked "View Other Requests" - redirect to property requests page
        router.push("/property-requests");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User clicked "Submit Another Request" - reset form and stay on page
        setFormData({
          name: "",
          email: "",
          phone: "",
          role: "",
          category: "",
          propertyType: "",
          propertyUsage: "",
          minBudget: "",
          maxBudget: "",
          state: "",
          lga: "",
          neighbourhood: "",
          note: "",
        });
        // Scroll to top of form
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      let message = "Failed to submit property request.";
      if (error.response) {
        if (error.response.status === 404) {
          message = "Service unavailable or endpoint not found (404).";
        } else if (error.response.data) {
          if (error.response.data.message) {
            message = error.response.data.message;
          } else if (error.response.data.error) {
            message = error.response.data.error;
          }
        } else if (error.response.statusText) {
          message = error.response.statusText;
        }
      } else if (error.message) {
        message = error.message;
      }
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner loading={loading} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <Search className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Property
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us what you're looking for and we'll let everyone know
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* User Details Section */}
          {!hasUserData && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mr-4">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Your Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="+234 801 234 5678"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Role
                  </label>
                  <select
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                  >
                    <option value="">Select your role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.slug}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Property Preferences Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mr-4">
                <Home className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Property Preferences
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Property Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                >
                  <option value="">Select category</option>
                  {listingTypes.map((type) => (
                    <option key={type._id} value={type.slug}>
                      {type.listingType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="propertyType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Property Type
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                >
                  <option value="">Select type</option>
                  {propertyTypes.map((type) => (
                    <option key={type._id} value={type.slug}>
                      {type.propertyType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="propertyUsage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Property Usage
                </label>
                <select
                  id="propertyUsage"
                  name="propertyUsage"
                  value={formData.propertyUsage}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                >
                  <option value="">Select usage</option>
                  {propertyUsages.map((usage) => (
                    <option key={usage._id} value={usage.slug}>
                      {usage.propertyUsage}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Budget Range
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    ₦
                  </span>
                  <input
                    type="number"
                    name="minBudget"
                    id="minBudget"
                    value={formData.minBudget}
                    onChange={handleChange}
                    required={!formData.maxBudget}
                    placeholder="Minimum budget"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    ₦
                  </span>
                  <input
                    type="number"
                    name="maxBudget"
                    id="maxBudget"
                    value={formData.maxBudget}
                    onChange={handleChange}
                    required={!formData.minBudget}
                    placeholder="Maximum budget"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                You can enter either a minimum, maximum, or both to specify your
                budget range.
              </p>
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mr-4">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Preferred Location
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                >
                  <option value="">Select state</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.slug}>
                      {state.state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lga"
                  className="block text-sm font-medium text-gray-700"
                >
                  Local Government
                </label>
                <select
                  id="lga"
                  name="lga"
                  value={formData.lga}
                  onChange={handleChange}
                  required
                  disabled={!formData.state}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">Select LGA</option>
                  {lgas.map((lga) => (
                    <option key={lga._id} value={lga.slug}>
                      {lga.lga}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="neighbourhood"
                  className="block text-sm font-medium text-gray-700"
                >
                  Neighborhood
                </label>
                <input
                  type="text"
                  name="neighbourhood"
                  id="neighbourhood"
                  value={formData.neighbourhood}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Ikeja GRA"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Additional Details
            </h3>
            <div className="space-y-2">
              <label
                htmlFor="note"
                className="block text-sm font-medium text-gray-700"
              >
                Tell us more about your preferences
              </label>
              <textarea
                id="note"
                name="note"
                rows="4"
                value={formData.note}
                onChange={handleChange}
                placeholder="Any specific features, amenities, or preferences you'd like to mention..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl disabled:shadow-md flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyRequestForm;
