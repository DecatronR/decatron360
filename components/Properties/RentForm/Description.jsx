import React, { useState, useEffect } from "react";
import { fetchPropertyTypes } from "utils/api/propertyListing/fetchPropertyTypes";
import { fetchPropertyConditions } from "utils/api/propertyListing/fetchPropertyConditions";
import { fetchPropertyUsage } from "utils/api/propertyListing/fetchPropertyUsage";

const SelectField = ({ label, id, name, value, options, onChange }) => (
  <div className="w-full">
    <label htmlFor={id} className="text-sm text-gray-600">
      {label}
    </label>
    <select
      id={id}
      name={name}
      className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
      required
      value={value || ""}
      onChange={onChange}
    >
      <option disabled value="">
        Select {label}
      </option>
      {options.length > 0 ? (
        options.map((option) => (
          <option key={option._id} value={option._slug || ""}>
            {option.propertyType ||
              option.propertyCondition ||
              option.propertyUsage ||
              "Unnamed"}
          </option>
        ))
      ) : (
        <option disabled>No options available</option>
      )}
    </select>
  </div>
);

const InputField = ({ label, id, name, value, placeholder, onChange }) => (
  <div className="w-full">
    <label htmlFor={id} className="text-sm text-gray-600">
      {label}
    </label>
    <input
      type="text"
      id={id}
      name={name}
      className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
      placeholder={placeholder}
      required
      value={value}
      onChange={onChange}
    />
  </div>
);

const Description = ({ fields, handleChange }) => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [propertyCondition, setPropertyCondition] = useState([]);
  const [propertyUsage, setPropertyUsage] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return;
    }

    Promise.allSettled([
      fetchPropertyTypes(),
      fetchPropertyConditions(),
      fetchPropertyUsage(),
    ])
      .then(([types, conditions, usage]) => {
        if (types.status === "fulfilled") setPropertyTypes([...types.value]);
        if (conditions.status === "fulfilled")
          setPropertyCondition([...conditions.value]);
        if (usage.status === "fulfilled") setPropertyUsage([...usage.value]);
      })
      .catch((err) => console.error("Error fetching property data:", err));
  }, []);

  return (
    <div className="shadow-md rounded-xl p-6 bg-white">
      <label className="block text-lg font-semibold text-gray-900">
        Property Description
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="col-span-1 md:col-span-2">
          <SelectField
            label="Property Type"
            id="propertyType"
            name="propertyType"
            value={fields.propertyType}
            options={propertyTypes}
            onChange={handleChange}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <InputField
            label="Listing Name"
            id="title"
            name="title"
            placeholder="e.g. Beautiful Apartment In Miami"
            value={fields.title}
            onChange={handleChange}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <SelectField
            label="Property Condition"
            id="propertyCondition"
            name="propertyCondition"
            value={fields.propertyCondition}
            options={propertyCondition}
            onChange={handleChange}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <SelectField
            label="Property Usage"
            id="usageType"
            name="usageType"
            value={fields.usageType}
            options={propertyUsage}
            onChange={handleChange}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label htmlFor="propertyDetails" className="text-sm text-gray-600">
            Description
          </label>
          <textarea
            id="propertyDetails"
            name="propertyDetails"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
            rows="4"
            placeholder="Add an optional description of your property"
            value={fields.propertyDetails}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Description;
