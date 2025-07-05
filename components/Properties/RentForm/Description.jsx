import React, { useState, useEffect } from "react";
import { fetchPropertyTypes } from "utils/api/propertyListing/fetchPropertyTypes";
import { fetchPropertyConditions } from "utils/api/propertyListing/fetchPropertyConditions";
import { fetchPropertyUsage } from "utils/api/propertyListing/fetchPropertyUsage";
import { FileText, Home, Settings, Tag } from "lucide-react";

const SelectField = ({ label, id, name, value, options, onChange }) => (
  <div className="w-full space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={id}
      name={name}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
      required
      value={value || ""}
      onChange={onChange}
    >
      <option disabled value="">
        Select {label}
      </option>
      {options.length > 0 ? (
        options.map((option) => (
          <option key={option._id} value={option.slug || ""}>
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

const InputField = ({
  label,
  id,
  name,
  value,
  placeholder,
  onChange,
  required = true,
}) => (
  <div className="w-full space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type="text"
      id={id}
      name={name}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
      placeholder={placeholder}
      required={required}
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mr-4">
          <FileText className="w-5 h-5 text-primary-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Property Details
        </h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Property Type"
            id="propertyType"
            name="propertyType"
            value={fields.propertyType}
            options={propertyTypes}
            onChange={handleChange}
          />

          <SelectField
            label="Property Condition"
            id="propertyCondition"
            name="propertyCondition"
            value={fields.propertyCondition}
            options={propertyCondition}
            onChange={handleChange}
          />
        </div>

        <InputField
          label="Listing Title"
          id="title"
          name="title"
          placeholder="e.g., Beautiful 3-Bedroom Apartment in Victoria Island"
          value={fields.title}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Property Usage"
            id="usageType"
            name="usageType"
            value={fields.usageType}
            options={propertyUsage}
            onChange={handleChange}
          />

          <InputField
            label="Title Document"
            id="titleDocument"
            name="titleDocument"
            placeholder="e.g., C of O, Deed of Assignment"
            value={fields.titleDocument}
            onChange={handleChange}
            required={false}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="propertyDetails"
            className="block text-sm font-medium text-gray-700"
          >
            Property Description
          </label>
          <textarea
            id="propertyDetails"
            name="propertyDetails"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
            rows="4"
            placeholder="Describe your property, its features, amenities, and what makes it special..."
            value={fields.propertyDetails}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Description;
