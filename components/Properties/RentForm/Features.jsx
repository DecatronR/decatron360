const Features = () => {
  return (
    <div>
      <div className="w-1/2">
        <label
          htmlFor="bedrooms"
          className="block text-gray-800 font-medium mb-3"
        >
          Beds
        </label>
        <input
          type="number"
          id="bedrooms"
          name="bedrooms"
          className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
          value={fields.bedrooms}
          onChange={handleChange}
        />
      </div>

      <div className="w-1/2">
        <label
          htmlFor="bathrooms"
          className="block text-gray-800 font-medium mb-3"
        >
          Baths
        </label>
        <input
          type="number"
          id="bathrooms"
          name="bathrooms"
          className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
          value={fields.bathrooms}
          onChange={handleChange}
        />
      </div>

      <div className="w-1/2">
        <label htmlFor="size" className="block text-gray-800 font-medium mb-3">
          Size
        </label>
        <input
          type="number"
          id="size"
          name="size"
          placeholder="Square Meter (Sqm)"
          className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
          value={fields.size}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Features;
