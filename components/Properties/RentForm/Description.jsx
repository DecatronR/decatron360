import React, { useState, useEffect } from "react";
import { fetchPropertyTypes } from "utils/api/propertyListing/fetchPropertyTypes";
import { fetchPropertyConditions } from "utils/api/propertyListing/fetchPropertyConditions";
import { fetchPropertyUsage } from "utils/api/propertyListing/fetchPropertyUsage";

const SelectField = ({ label, id, name, value, options, onChange }) => (
  <div className="w-full mb-6">
    <label htmlFor={id} className="block text-gray-800 font-medium mb-3">
      {label}
    </label>
    <select
      id={id}
      name={name}
      className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
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
  <div className="w-full mb-6">
    <label htmlFor={id} className="block text-gray-800 font-medium mb-3">
      {label}
    </label>
    <input
      type="text"
      id={id}
      name={name}
      className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
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
        if (types.status === "fulfilled") {
          console.log("Property Types:", types.value); // Debugging
          setPropertyTypes([...types.value]);
        }
        if (conditions.status === "fulfilled") {
          console.log("Property Conditions:", conditions.value); // Debugging
          setPropertyCondition([...conditions.value]);
        }
        if (usage.status === "fulfilled") {
          console.log("Property Usage:", usage.value); // Debugging
          setPropertyUsage([...usage.value]);
        }
      })
      .catch((err) => console.error("Error fetching property data:", err));
  }, []);

  return (
    <div>
      <SelectField
        label="Property Type"
        id="propertyType"
        name="propertyType"
        value={fields.propertyType}
        options={propertyTypes}
        onChange={handleChange}
      />

      <InputField
        label="Listing Name"
        id="title"
        name="title"
        placeholder="e.g. Beautiful Apartment In Miami"
        value={fields.title}
        onChange={handleChange}
      />

      <div className="flex gap-4">
        <SelectField
          label="Property Condition"
          id="propertyCondition"
          name="propertyCondition"
          value={fields.propertyCondition}
          options={propertyCondition}
          onChange={handleChange}
        />

        <SelectField
          label="Property Usage"
          id="usageType"
          name="usageType"
          value={fields.usageType}
          options={propertyUsage}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Description;
