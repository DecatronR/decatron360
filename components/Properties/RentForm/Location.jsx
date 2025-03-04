import React, { useState, useEffect, useCallback } from "react";
import { fetchStates } from "utils/api/propertyListing/fetchStates";
import { fetchLga } from "utils/api/propertyListing/fetchLga";

const Location = ({ fields, handleChange }) => {
  const [states, setStates] = useState([]);
  const [lga, setLga] = useState([]);

  const fetchData = useCallback(async (fetchFunction, setter) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return;
    }
    try {
      const data = await fetchFunction();
      setter(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.allSettled([
        fetchData(fetchStates, setStates),
        fetchData(fetchLga, setLga),
      ]);
    };

    fetchAllData();
  }, [fetchData]);

  return (
    <div>
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <label className="block text-gray-800 font-medium mb-3">Location</label>
        <div className="flex space-x-4">
          <select
            id="state"
            name="state"
            className="border rounded-lg w-1/3 py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
            required
            value={fields.state}
            onChange={handleChange}
          >
            <option disabled value="">
              Select State
            </option>
            {states.map((type) => (
              <option key={type._id} value={type._slug}>
                {type.state}
              </option>
            ))}
          </select>

          <select
            id="lga"
            name="lga"
            className="border rounded-lg w-1/3 py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
            required
            value={fields.lga}
            onChange={handleChange}
          >
            <option disabled value="">
              Select LGA
            </option>
            {lga.map((type) => (
              <option key={type._id} value={type._slug}>
                {type.lga}
              </option>
            ))}
          </select>

          <input
            type="text"
            id="neighbourhood"
            name="neighbourhood"
            className="border rounded-lg w-1/3 py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
            placeholder="Neighbourhood"
            value={fields.neighbourhood}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Location;
