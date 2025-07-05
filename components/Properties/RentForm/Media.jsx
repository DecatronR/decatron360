import { useState, useEffect } from "react";
import { XIcon, Upload, Video, Globe, Image } from "lucide-react";
import { useSnackbar } from "notistack";

const Media = ({
  fields,
  setFields,
  handleChange,
  existingImages = [],
  isEditMode = false,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    const newPreviewUrls = [];

    const currentImageCount = isEditMode
      ? existingImages.length - imagesToDelete.length + uploadedImages.length
      : uploadedImages.length;

    for (
      let i = 0;
      i < files.length && currentImageCount + newImages.length < 7;
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

  const handleImageRemove = (index, isExisting = false) => {
    if (isExisting) {
      // Remove existing image
      const imageToRemove = existingImages[index];
      setImagesToDelete((prev) => [...prev, imageToRemove]);

      setFields((prevFields) => ({
        ...prevFields,
        photo: prevFields.photo.filter((img) => img !== imageToRemove),
      }));
    } else {
      // Remove newly uploaded image
      const imageToRemove = uploadedImages[index];
      URL.revokeObjectURL(previewUrls[index]);

      setPreviewUrls(previewUrls.filter((_, i) => i !== index));
      setUploadedImages(uploadedImages.filter((_, i) => i !== index));

      setFields((prevFields) => ({
        ...prevFields,
        photo: prevFields.photo.filter((img) => img !== imageToRemove),
      }));
    }
  };

  const getCurrentImageCount = () => {
    if (isEditMode) {
      return (
        existingImages.length - imagesToDelete.length + uploadedImages.length
      );
    }
    return uploadedImages.length;
  };

  const canAddMoreImages = getCurrentImageCount() < 7;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mr-4">
          <Image className="w-5 h-5 text-primary-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Media & Links</h2>
      </div>

      <div className="space-y-8">
        {/* Virtual Tour & Video Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="virtualTour"
              className="block text-sm font-medium text-gray-700"
            >
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-primary-600" />
                Virtual Tour URL
              </div>
            </label>
            <input
              type="text"
              id="virtualTour"
              name="virtualTour"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
              placeholder="https://my.matterport.com/show/?m=virtual-tour-id"
              value={fields.virtualTour}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="video"
              className="block text-sm font-medium text-gray-700"
            >
              <div className="flex items-center">
                <Video className="w-4 h-4 mr-2 text-primary-600" />
                Video URL
              </div>
            </label>
            <input
              type="text"
              id="video"
              name="video"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
              placeholder="https://www.youtube.com/watch?v=video-id"
              value={fields.video}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Images Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="photo"
              className="block text-sm font-medium text-gray-700"
            >
              <div className="flex items-center">
                <Upload className="w-4 h-4 mr-2 text-primary-600" />
                Property Images
              </div>
            </label>
            <span className="text-sm text-gray-500">
              {getCurrentImageCount()}/7 images
            </span>
          </div>

          <div className="relative">
            <input
              type="file"
              id="photo"
              name="photo"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={!canAddMoreImages}
              aria-label="Upload images for your property listing (Max 7)"
            />
            {!canAddMoreImages && (
              <p className="text-sm text-orange-600 mt-2">
                Maximum 7 images reached. Remove some images to add more.
              </p>
            )}
          </div>

          {/* Image Preview Section */}
          {(existingImages.length > 0 || previewUrls.length > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {/* Existing Images */}
              {isEditMode &&
                existingImages.map((imageUrl, index) => {
                  const isDeleted = imagesToDelete.includes(imageUrl);
                  if (isDeleted) return null;

                  return (
                    <div
                      key={`existing-${index}`}
                      className="relative aspect-square rounded-xl border border-gray-200 overflow-hidden group"
                    >
                      <img
                        src={imageUrl}
                        alt={`Existing ${index}`}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          console.error("Failed to load image:", imageUrl);
                          e.target.style.display = "none";
                        }}
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 text-xs hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                        onClick={() => handleImageRemove(index, true)}
                      >
                        <XIcon size={12} />
                      </button>
                    </div>
                  );
                })}

              {/* New Uploaded Images */}
              {previewUrls.map((previewUrl, index) => (
                <div
                  key={`new-${index}`}
                  className="relative aspect-square rounded-xl border border-gray-200 overflow-hidden group"
                >
                  <img
                    src={previewUrl}
                    alt={`Preview ${index}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 text-xs hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                    onClick={() => handleImageRemove(index, false)}
                  >
                    <XIcon size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* No images message for debugging */}
          {isEditMode &&
            existingImages.length === 0 &&
            previewUrls.length === 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 text-center">
                No existing images found. You can upload new images above.
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Media;
