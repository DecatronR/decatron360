import React, { useState, useEffect } from "react";
import { fetchStates } from "@/utils/api/propertyListing/location/fetchStates";
import { fetchLGAsByStateId } from "@/utils/api/propertyListing/location/fetchLGAsByStateId";
import { MapPin, Home, Navigation } from "lucide-react";

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
        // Find the selected state to get its ID
        const selectedState = states.find(
          (state) => state.slug === fields.state
        );
        if (!selectedState) {
          console.error("Selected state not found");
          return;
        }

        const response = await fetchLGAsByStateId(selectedState._id);
        // Handle the API response structure (extract data if needed)
        const data = response.data || response;
        setLga(data || []);
      } catch (err) {
        console.error("Error fetching LGAs:", err);
      } finally {
        setLoadingLGA(false);
      }
    };

    fetchLGAData();
  }, [fields.state, states]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mr-4">
          <MapPin className="w-5 h-5 text-primary-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Location Details
        </h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* State Dropdown */}
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
              required
              value={fields.state}
              onChange={handleChange}
            >
              <option disabled value="">
                Select state
              </option>
              {states.length > 0 ? (
                states.map((type) => (
                  <option key={type._id} value={type.slug}>
                    {type.state}
                  </option>
                ))
              ) : (
                <option disabled>No states available</option>
              )}
            </select>
          </div>

          {/* LGA Dropdown */}
          <div className="space-y-2">
            <label
              htmlFor="lga"
              className="block text-sm font-medium text-gray-700"
            >
              Local Government Area
            </label>
            <div className="relative">
              <select
                id="lga"
                name="lga"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-400"
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
                      <option key={type._id} value={type.slug}>
                        {type.lga}
                      </option>
                    ))
                  : !loadingLGA && <option disabled>No LGAs available</option>}
              </select>

              {/* Loading Spinner */}
              {loadingLGA && (
                <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Neighbourhood Input */}
          <div className="space-y-2">
            <label
              htmlFor="neighbourhood"
              className="block text-sm font-medium text-gray-700"
            >
              Neighborhood
            </label>
            <input
              type="text"
              id="neighbourhood"
              name="neighbourhood"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
              placeholder="e.g., Victoria Island, Lekki Phase 1"
              value={fields.neighbourhood}
              onChange={handleChange}
            />
          </div>

          {/* House number and Street Input */}
          <div className="space-y-2">
            <label
              htmlFor="houseNoStreet"
              className="block text-sm font-medium text-gray-700"
            >
              House Number & Street
            </label>
            <input
              type="text"
              id="houseNoStreet"
              name="houseNoStreet"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
              placeholder="This will be hidden from other users"
              value={fields.houseNoStreet}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
