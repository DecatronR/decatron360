const Description = ({ fields, handleChange }) => {
  return (
    <div>
      <div className="mb-6">
        <label
          htmlFor="propertyType"
          className="block text-gray-800 font-medium mb-3"
        >
          Property Type
        </label>
        <select
          id="propertyType"
          name="propertyType"
          className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
          required
          value={fields.propertyType}
          onChange={handleChange}
        >
          <option disabled value="">
            Select Property Type
          </option>
          {propertyTypes.map((type) => (
            <option key={type._id} value={type._slug}>
              {type.propertyType}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="title" className="block text-gray-800 font-medium mb-3">
          Listing Name
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
          placeholder="e.g. Beautiful Apartment In Miami"
          required
          value={fields.title}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label
            htmlFor="property_condition"
            className="block text-gray-800 font-medium mb-3"
          >
            Property Condition
          </label>
          <select
            id="propertyCondition"
            name="propertyCondition"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
            required
            value={fields.propertyCondition}
            onChange={handleChange}
          >
            <option disabled value="">
              Select Condition
            </option>
            {propertyCondition.map((type) => (
              <option key={type._id} value={type._slug}>
                {type.propertyCondition}
              </option>
            ))}
          </select>
        </div>

        <div className="w-1/2">
          <label
            htmlFor="usage_type"
            className="block text-gray-800 font-medium mb-3"
          >
            Property Usage
          </label>
          <select
            id="usageType"
            name="usageType"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
            required
            value={fields.usageType}
            onChange={handleChange}
          >
            <option disabled value="">
              Select Usage Type
            </option>
            {propertyUsage.map((type) => (
              <option key={type._id} value={type._slug}>
                {type.propertyUsage}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Description;
