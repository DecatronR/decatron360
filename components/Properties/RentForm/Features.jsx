const Features = ({ fields, handleChange }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
      <label className="block text-lg font-semibold text-gray-900">
        Features
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Size */}
        <div>
          <label htmlFor="size" className="text-sm text-gray-600">
            Size (Sqm)
          </label>
          <input
            type="number"
            id="size"
            name="size"
            placeholder="Square Meter (Sqm)"
            className="border rounded-lg w-full py-3 px-4 bg-gray-50 focus:ring-blue-300"
            value={fields.size}
            onChange={handleChange}
          />
        </div>
        {/* Bedrooms */}
        <div>
          <label htmlFor="bedrooms" className="text-sm text-gray-600">
            Beds
          </label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            className="border rounded-lg w-full py-3 px-4 bg-gray-50 focus:ring-blue-300"
            value={fields.bedrooms}
            onChange={handleChange}
          />
        </div>

        {/* Bathrooms */}
        <div>
          <label htmlFor="bathrooms" className="text-sm text-gray-600">
            Baths
          </label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            className="border rounded-lg w-full py-3 px-4 bg-gray-50 focus:ring-blue-300"
            value={fields.bathrooms}
            onChange={handleChange}
          />
        </div>

        {/* Living Rooms */}
        <div>
          <label htmlFor="livingrooms" className="text-sm text-gray-600">
            Living Rooms
          </label>
          <input
            type="number"
            id="livingrooms"
            name="livingrooms"
            className="border rounded-lg w-full py-3 px-4 bg-gray-50 focus:ring-blue-300"
            value={fields.livingrooms}
            onChange={handleChange}
          />
        </div>

        {/* Parking Space */}
        <div>
          <label htmlFor="parkingSpace" className="text-sm text-gray-600">
            Parking Space
          </label>
          <input
            type="number"
            id="parkingSpace"
            name="parkingSpace"
            className="border rounded-lg w-full py-3 px-4 bg-gray-50 focus:ring-blue-300"
            value={fields.parkingSpace}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Features;
