import { useState } from "react";

const Media = ({ fields, handleChange, handleImageChange }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  return (
    <div>
      <div className="mb-6">
        <label
          htmlFor="virtual_tour"
          className="block text-gray-800 font-medium mb-3"
        >
          Virtual Tour
        </label>
        <input
          type="text"
          id="virtualTour"
          name="virtualTour"
          className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
          placeholder="https://my.matterport.com/show/?m=virtual-tour-id"
          value={fields.virtualTour}
          onChange={handleChange}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="video" className="block text-gray-800 font-medium mb-3">
          Video
        </label>
        <input
          type="text"
          id="video"
          name="video"
          className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
          placeholder="https://www.youtube.com/watch?v=video-id"
          value={fields.video}
          onChange={handleChange}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="photo" className="block text-gray-800 font-medium mb-3">
          Images (Select up to 7 images)
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          required
          aria-label="Upload images for your property listing (Maximum 7 images)"
        />

        {previewUrls.length > 0 && (
          <div className="flex gap-4 mt-4 flex-wrap">
            {previewUrls.map((previewUrl, index) => (
              <div
                key={index}
                className="relative w-28 h-28 rounded-lg border border-gray-300 overflow-hidden"
              >
                <img
                  src={previewUrl}
                  alt={`Preview ${index}`}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  onClick={() => handleImageRemove(index)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Media;
