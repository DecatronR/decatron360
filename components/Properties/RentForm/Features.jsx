import { Bed, Bath, Square } from "lucide-react";

const Features = ({ fields, handleChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mr-4">
          <Bed className="w-5 h-5 text-primary-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Property Features
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Size */}
        <div className="space-y-2">
          <label
            htmlFor="size"
            className="block text-sm font-medium text-gray-700"
          >
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-2 text-primary-600" />
              Size (Sqm)
            </div>
          </label>
          <input
            type="number"
            id="size"
            name="size"
            placeholder="e.g., 150"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
            value={fields.size}
            onChange={handleChange}
          />
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <label
            htmlFor="bedrooms"
            className="block text-sm font-medium text-gray-700"
          >
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-2 text-primary-600" />
              Bedrooms
            </div>
          </label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            placeholder="e.g., 3"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
            value={fields.bedrooms}
            onChange={handleChange}
          />
        </div>

        {/* Bathrooms */}
        <div className="space-y-2">
          <label
            htmlFor="bathrooms"
            className="block text-sm font-medium text-gray-700"
          >
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-2 text-primary-600" />
              Bathrooms
            </div>
          </label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            placeholder="e.g., 2"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
            value={fields.bathrooms}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Features;
