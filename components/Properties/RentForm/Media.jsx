import { useState } from "react";
import { XIcon } from "lucide-react";

const Media = ({ fields, handleChange }) => {
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    const newPreviewUrls = [];

    for (
      let i = 0;
      i < files.length && uploadedImages.length + newImages.length < 7;
      i++
    ) {
      const file = files[i];

      if (file.size > 5 * 1024 * 1024) {
        enqueueSnackbar(`${file.name} is too large, maximum file size is 5MB`, {
          variant: "error",
        });
        continue;
      }

      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        enqueueSnackbar(
          `${file.name} is not a supported format. Only jpeg, jpg and png are allowed.`,
          { variant: "error" }
        );
        continue;
      }

      newImages.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    }

    setUploadedImages([...uploadedImages, ...newImages]);
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);

    setFields((prevFields) => ({
      ...prevFields,
      photo: [...prevFields.photo, ...newImages],
    }));
  };

  const handleImageRemove = (index) => {
    URL.revokeObjectURL(previewUrls[index]);

    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));

    setFields((prevFields) => ({
      ...prevFields,
      photo: prevFields.photo.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="shadow-md rounded-lg p-6 bg-white max-w-md mx-auto md:max-w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Virtual Tour & Video - Stacked on Mobile, Side-by-Side on Desktop */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="virtualTour"
              className="text-sm text-gray-600 block mb-1"
            >
              Virtual Tour
            </label>
            <input
              type="text"
              id="virtualTour"
              name="virtualTour"
              className="border rounded-md w-full py-2 px-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
              placeholder="https://my.matterport.com/show/?m=virtual-tour-id"
              value={fields.virtualTour}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="video" className="text-sm text-gray-600 block mb-1">
              Video
            </label>
            <input
              type="text"
              id="video"
              name="video"
              className="border rounded-md w-full py-2 px-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
              placeholder="https://www.youtube.com/watch?v=video-id"
              value={fields.video}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Images */}
        <div className="col-span-2">
          <label htmlFor="photo" className="text-sm text-gray-600 block mb-1">
            Images (Max 7)
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            className="border rounded-md w-full py-2 px-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            required
            aria-label="Upload images for your property listing (Max 7)"
          />

          {/* Image Preview Section */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
              {previewUrls.map((previewUrl, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md border border-gray-300 overflow-hidden"
                >
                  <img
                    src={previewUrl}
                    alt={`Preview ${index}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-1 text-xs"
                    onClick={() => handleImageRemove(index)}
                  >
                    <XIcon size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Media;
