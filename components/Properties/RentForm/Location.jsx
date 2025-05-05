import React, { useState, useEffect } from "react";
import { fetchStates } from "utils/api/propertyListing/fetchStates";
import { fetchLga } from "utils/api/propertyListing/fetchLga";

const Location = ({ fields, handleChange }) => {
  const [states, setStates] = useState([]);
  const [lga, setLga] = useState([]);
  const [loadingLGA, setLoadingLGA] = useState(false);

  // Fetch states on mount
  useEffect(() => {
    const fetchStatesData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found in session storage");
        return;
      }
      try {
        const data = await fetchStates();
        setStates(data || []);
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };

    fetchStatesData();
  }, []);

  // Fetch LGA when state changes
  useEffect(() => {
    if (!fields.state) return;

    const fetchLGAData = async () => {
      setLoadingLGA(true);
      try {
        const data = await fetchLga(fields.state);
        setLga(data || []);
      } catch (err) {
        console.error("Error fetching LGAs:", err);
      } finally {
        setLoadingLGA(false);
      }
    };

    fetchLGAData();
  }, [fields.state]);

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <label className="block text-gray-800 text-lg font-semibold mb-4">
        Location Details
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* State Dropdown */}
        <div className="relative">
          <label htmlFor="state" className="block text-gray-600 text-sm mb-2">
            State
          </label>
          <select
            id="state"
            name="state"
            className="w-full border rounded-lg py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
            value={fields.state}
            onChange={handleChange}
          >
            <option disabled value="">
              Select State
            </option>
            {states.length > 0 ? (
              states.map((type) => (
                <option key={type._id} value={type._slug}>
                  {type.state}
                </option>
              ))
            ) : (
              <option disabled>No states available</option>
            )}
          </select>
        </div>

        {/* LGA Dropdown */}
        <div className="relative">
          <label htmlFor="lga" className="block text-gray-600 text-sm mb-2">
            Local Government Area
          </label>
          <select
            id="lga"
            name="lga"
            className="w-full border rounded-lg py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
            value={fields.lga}
            onChange={handleChange}
            disabled={!fields.state}
          >
            <option disabled value="">
              {loadingLGA ? "Loading LGAs..." : "Select LGA"}
            </option>
            {lga.length > 0
              ? lga.map((type) => (
                  <option key={type._id} value={type._slug}>
                    {type.lga}
                  </option>
                ))
              : !loadingLGA && <option disabled>No LGAs available</option>}
          </select>

          {/* Loading Spinner */}
          {loadingLGA && (
            <div className="absolute top-10 right-4">
              <svg
                className="w-5 h-5 text-blue-500 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          )}
        </div>

        {/* Neighbourhood Input */}
        <div>
          <label
            htmlFor="neighbourhood"
            className="block text-gray-600 text-sm mb-2"
          >
            Neighbourhood
          </label>
          <input
            type="text"
            id="neighbourhood"
            name="neighbourhood"
            className="w-full border rounded-lg py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Enter Neighbourhood"
            value={fields.neighbourhood}
            onChange={handleChange}
          />
        </div>
        {/*  House number and  Street Input */}
        <div>
          <label
            htmlFor="neighbourhood"
            className="block text-gray-600 text-sm mb-2"
          >
            House No and Street
          </label>
          <input
            type="text"
            id="houseNoStreet"
            name="houseNoStreet"
            className="w-full border rounded-lg py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="This details will be hidden from other users"
            value={fields.houseNoStreet}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Location;
