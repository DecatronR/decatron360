"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "notistack";
import { createPropertyRequest } from "@/utils/api/propertyRequest/createPropertyRequest";
import { fetchListingTypes } from "utils/api/propertyListing/fetchListingTypes";
import { fetchPropertyTypes } from "@/utils/api/propertyListing/fetchPropertyTypes";
import { fetchPropertyUsage } from "@/utils/api/propertyListing/fetchPropertyUsage";
import { fetchStates } from "@/utils/api/propertyListing/fetchStates";
import { fetchLga } from "@/utils/api/propertyListing/fetchLga";
import { fetchRoles } from "../../utils/api/registration/fetchRoles";
import Spinner from "@/components/ui/Spinner";

const PropertyRequestForm = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    category: "",
    propertyType: "",
    propertyUsage: "",
    budget: "",
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
    setIsSubmitting(true);
    try {
      await createPropertyRequest(payload);
      enqueueSnackbar("Property request submitted successfully!", {
        variant: "success",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
        category: "",
        propertyType: "",
        propertyUsage: "",
        budget: "",
        state: "",
        lga: "",
        neighbourhood: "",
        note: "",
      });
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
    return <Spinner loading={loading} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white shadow-lg rounded-xl p-6 max-w-2xl w-full mx-auto border border-gray-200"
    >
      <h2 className="text-2xl text-center font-bold mb-8 text-gray-900">
        Property Request Form
      </h2>

      {/* User Details (only if not logged in or missing info) */}
      {!hasUserData && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            Your Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-semibold mb-1 text-sm"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-1 text-sm"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-gray-700 font-semibold mb-1 text-sm"
              >
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-gray-700 font-semibold mb-1 text-sm"
              >
                Role
              </label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition text-sm"
              >
                <option value="">Select Role</option>
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

      {/* Property Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          Property Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-gray-700 font-semibold mb-1 text-sm"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition text-sm"
            >
              <option value="">Select Category</option>
              {listingTypes.map((type) => (
                <option key={type._id} value={type.slug}>
                  {type.listingType}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="propertyType"
              className="block text-gray-700 font-semibold mb-1 text-sm"
            >
              Property Type
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
              className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition text-sm"
            >
              <option value="">Select Property Type</option>
              {propertyTypes.map((type) => (
                <option key={type._id} value={type.slug}>
                  {type.propertyType}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="propertyUsage"
              className="block text-gray-700 font-semibold mb-1 text-sm"
            >
              Property Usage
            </label>
            <select
              id="propertyUsage"
              name="propertyUsage"
              value={formData.propertyUsage}
              onChange={handleChange}
              required
              className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition text-sm"
            >
              <option value="">Select Property Usage</option>
              {propertyUsages.map((usage) => (
                <option key={usage._id} value={usage.slug}>
                  {usage.propertyUsage}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="budget"
              className="block text-gray-700 font-semibold mb-1 text-sm"
            >
              Budget (NGN)
            </label>
            <input
              type="number"
              name="budget"
              id="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              placeholder="e.g., 5000000"
              className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-gray-700 font-semibold mb-1 text-sm"
            >
              State
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition text-sm"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.id} value={state.slug}>
                  {state.state}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="lga"
              className="block text-gray-700 font-semibold mb-1 text-sm"
            >
              LGA
            </label>
            <select
              id="lga"
              name="lga"
              value={formData.lga}
              onChange={handleChange}
              required
              disabled={!formData.state}
              className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition text-sm disabled:bg-gray-50"
            >
              <option value="">Select LGA</option>
              {lgas.map((lga) => (
                <option key={lga._id} value={lga.slug}>
                  {lga.lga}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="neighbourhood"
              className="block text-gray-700 font-semibold mb-1 text-sm"
            >
              Neighbourhood
            </label>
            <input
              type="text"
              name="neighbourhood"
              id="neighbourhood"
              value={formData.neighbourhood}
              onChange={handleChange}
              required
              placeholder="e.g., Ikeja GRA"
              className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition text-sm"
            />
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="note"
              className="block text-gray-700 font-semibold mb-1 text-sm"
            >
              Additional Notes
            </label>
            <textarea
              id="note"
              name="note"
              rows="4"
              value={formData.note}
              onChange={handleChange}
              placeholder="Any specific features, preferences, or details..."
              className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition text-sm"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="submit"
          className="bg-primary-600 text-white px-6 py-3 rounded-full transition hover:bg-primary-700 shadow-md flex items-center justify-center w-full font-bold"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </form>
  );
};

export default PropertyRequestForm;
