"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchListingTypes } from "@/utils/api/propertyListing/fetchListingTypes";
import { fetchPropertyTypes } from "@/utils/api/propertyListing/fetchPropertyTypes";
import { fetchPropertyUsage } from "@/utils/api/propertyListing/fetchPropertyUsage";
import { fetchStates } from "@/utils/api/propertyListing/fetchStates";
import { fetchLga } from "@/utils/api/propertyListing/fetchLga";
import Spinner from "@/components/ui/Spinner";

const PropertyRequestForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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

  // Data for dropdowns
  const [listingTypes, setListingTypes] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [propertyUsages, setPropertyUsages] = useState([]);
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);

  useEffect(() => {
    // Pre-fill user data if logged in
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting property request:", formData);
    // TODO: Implement API call to submit the form data
  };

  if (loading) {
    return <Spinner loading={loading} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* User Details */}
      <div className="border-b border-gray-200 pb-8">
        <h3 className="text-xl font-semibold leading-7 text-gray-900">
          Your Details
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Please provide your contact information.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
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
              className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
          {/* ... other user fields ... */}
          <div className="sm:col-span-3">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
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
              className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="phone"
              className="block text-sm font-medium leading-6 text-gray-900"
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
              className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div>
        <h3 className="text-xl font-semibold leading-7 text-gray-900">
          Property Details
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Describe the property you are looking for.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <option value="">Select Category</option>
              {listingTypes.map((type) => (
                <option key={type._id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="propertyType"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Property Type
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <option value="">Select Property Type</option>
              {propertyTypes.map((type) => (
                <option key={type._id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="propertyUsage"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Property Usage
            </label>
            <select
              id="propertyUsage"
              name="propertyUsage"
              value={formData.propertyUsage}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <option value="">Select Property Usage</option>
              {propertyUsages.map((usage) => (
                <option key={usage._id} value={usage.name}>
                  {usage.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-6">
            <label
              htmlFor="budget"
              className="block text-sm font-medium leading-6 text-gray-900"
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
              className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="state"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              State
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="lga"
              className="block text-sm font-medium leading-6 text-gray-900"
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
              className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 disabled:bg-gray-50"
            >
              <option value="">Select LGA</option>
              {lgas.map((lga) => (
                <option key={lga.id} value={lga.name}>
                  {lga.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="neighbourhood"
              className="block text-sm font-medium leading-6 text-gray-900"
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
              className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="col-span-full">
            <label
              htmlFor="note"
              className="block text-sm font-medium leading-6 text-gray-900"
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
              className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-10">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
        >
          Submit Request
        </button>
      </div>
    </form>
  );
};

export default PropertyRequestForm;
