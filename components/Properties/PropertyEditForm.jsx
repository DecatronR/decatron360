"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "components/ui/Spinner";
import ButtonSpinner from "components/ui/ButtonSpinner";
import { useSnackbar } from "notistack";
import { editPropertyListing } from "@/utils/api/propertyListing/editPropertyListing";
import { updatePropertyListing } from "@/utils/api/propertyListing/updatePropertyListing";

const PropertyEditForm = ({ propertyId }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [fields, setFields] = useState({});
  const [propertyData, setPropertyData] = useState({});
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [lga, setLga] = useState([]);
  const [propertyCondition, setPropertyCondition] = useState([]);
  const [propertyUsage, setPropertyUsage] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    if (propertyData && propertyId) {
      setFields({
        id: propertyData?.data?._id,
        title: propertyData?.data?.title || "",
        listingType: propertyData?.data?.listingType || "",
        usageType: propertyData?.data?.usageType || "",
        propertyType: propertyData?.data?.propertyType || "",
        propertySubType: propertyData?.data?.propertySubType || "",
        propertyCondition: propertyData?.data?.propertyCondition || "",
        state: propertyData?.data?.state || "",
        lga: propertyData?.data?.lga || "",
        neighbourhood: propertyData?.data?.neighbourhood || "",
        size: propertyData?.data?.size || "",
        propertyDetails: propertyData?.data?.propertyDetails || "",
        livingrooms: propertyData?.data?.livingrooms || "",
        bedrooms: propertyData?.data?.bedrooms || "",
        bathrooms: propertyData?.data?.bathrooms || "",
        parkingSpace: propertyData?.data?.parkingSpace || "",
        price: propertyData?.data?.price || "",
        virtualTour: propertyData?.data?.virtualTour || "",
        inspectionFee: propertyData?.data?.inspectionFee || "",
        inspectionFee: propertyData?.data?.titleDocument || "",
        video: propertyData?.data?.video || "",
        photo: propertyData?.photos || [],
      });
      setExistingImages(propertyData?.data?.photos || []);
    }
  }, [propertyData]);

  //fetch property data for editing
  useEffect(() => {
    const handlefetchPropertyData = async () => {
      try {
        const res = await editPropertyListing(propertyId);
        setPropertyData(res);
        setIsLoading(false);
      } catch (error) {
        enqueueSnackbar("Failed to fetch property data for editing!", {
          variant: "error",
        });
        setIsLoading(false);
      }
    };
    handlefetchPropertyData();
  }, [propertyId, enqueueSnackbar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

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
      if (
        file.size > 5 * 1024 * 1024 ||
        !["image/jpeg", "image/png"].includes(file.type)
      ) {
        enqueueSnackbar(
          `${file.name} is either too large or not a supported format.`,
          {
            variant: "warning",
          }
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

  const handleImageRemove = (index, isExisting) => {
    if (isExisting) {
      const imageToRemove = existingImages[index];
      setImagesToDelete((prev) => [...prev, imageToRemove]);
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const formatPrice = (price) => {
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(numericPrice);
  };

  const fetchData = useCallback(async (url, setter) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return;
    }
    try {
      const res = await axios.get(url, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      setter(data);
    } catch (err) {
      console.log(`Issue fetching data from ${url}`);
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchData(
          `${baseUrl}/propertyType/fetchPropertyType`,
          setPropertyTypes
        ),
        fetchData(`${baseUrl}/state/fetchState`, setStates),
        fetchData(`${baseUrl}/lga/fetchLGA`, setLga),
        fetchData(
          `${baseUrl}/propertyCondition/fetchPropertyCondition`,
          setPropertyCondition
        ),
        fetchData(
          `${baseUrl}/propertyUsage/fetchPropertyUsage`,
          setPropertyUsage
        ),
      ]);
    };

    fetchAllData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append text fields
    formData.append("id", fields.id);
    formData.append("title", fields.title);
    formData.append("listingType", fields.listingType);
    formData.append("usageType", fields.usageType);
    formData.append("propertyType", fields.propertyType);
    formData.append("propertySubType", fields.propertySubType);
    formData.append("propertyCondition", fields.propertyCondition);
    formData.append("state", fields.state);
    formData.append("lga", fields.lga);
    formData.append("neighbourhood", fields.neighbourhood);
    formData.append("size", fields.size);
    formData.append("propertyDetails", fields.propertyDetails);
    formData.append("livingRooms", fields.livingRooms);
    formData.append("bedrooms", fields.bedrooms);
    formData.append("bathrooms", fields.bathrooms);
    formData.append("parkingSpace", fields.parkingSpace);
    formData.append("price", fields.price);
    formData.append("inspectionFee", fields.inspectionFee);
    formData.append("titleDocument", fields.titleDocument);
    formData.append("virtualTour", fields.virtualTour);
    formData.append("video", fields.video);

    // Append existing images
    existingImages.forEach((image, index) => {
      formData.append(`existingImages[${index}]`, image);
    });

    // Append images to delete
    imagesToDelete.forEach((image, index) => {
      formData.append(`imagesToDelete[${index}]`, image);
    });

    // Append new uploaded images
    uploadedImages.forEach((photo, index) => {
      formData.append(`photo[${index}]`, photo);
    });

    setIsButtonLoading(true);
    try {
      await updatePropertyListing(formData);
      enqueueSnackbar("Successfully listed new property!", {
        variant: "success",
      });

      router.push(`/properties/${fields.id}`);
    } catch (error) {
      enqueueSnackbar(`Failed to edit property: ${error.message}`, {
        variant: "error",
      });
    } finally {
      setIsButtonLoading(false);
    }
  };

  useEffect(() => {
    // Cleanup preview URLs to avoid memory leaks
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const existingImagesWithData = existingImages.map((url, index) => ({
    url,
    isExisting: true,
    index,
  }));

  const newImagesWithData = previewUrls.map((url, index) => ({
    url,
    isExisting: false,
    index,
  }));

  const imagesToDisplay = [...existingImagesWithData, ...newImagesWithData];

  return isLoading ? (
    <Spinner />
  ) : (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white shadow-md rounded-lg p-6"
    >
      <h2 className="text-4xl text-center font-bold mb-8 text-gray-800">
        Edit Property
      </h2>

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
      <div className="mb-6">
        <label
          htmlFor="titleDocument"
          className="block text-gray-800 font-medium mb-3"
        >
          Title Document
        </label>
        <input
          type="text"
          id="titleDocument"
          name="titleDocument"
          className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
          placeholder="e.g. C of O, Deed of Assignment"
          value={fields.titleDocument}
          onChange={handleChange}
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="property_details"
          className="block text-gray-800 font-medium mb-3"
        >
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

      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <label className="block text-gray-800 font-medium mb-3">Location</label>
        <div className="flex space-x-4">
          <select
            id="state"
            name="state"
            className="border rounded-lg w-1/3 py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
            required
            value={fields.state}
            onChange={handleChange}
          >
            <option disabled value="">
              Select State
            </option>
            {states.map((type) => (
              <option key={type._id} value={type._slug}>
                {type.state}
              </option>
            ))}
          </select>

          <select
            id="lga"
            name="lga"
            className="border rounded-lg w-1/3 py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
            required
            value={fields.lga}
            onChange={handleChange}
          >
            <option disabled value="">
              Select LGA
            </option>
            {lga.map((type) => (
              <option key={type._id} value={type._slug}>
                {type.lga}
              </option>
            ))}
          </select>

          <input
            type="text"
            id="neighbourhood"
            name="neighbourhood"
            className="border rounded-lg w-1/3 py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
            placeholder="Neighbourhood"
            value={fields.neighbourhood}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex gap-4">
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
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label
            htmlFor="size"
            className="block text-gray-800 font-medium mb-3"
          >
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

        <div className="w-1/2">
          <label
            htmlFor="price"
            className="block text-gray-800 font-medium mb-3"
          >
            Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            placeholder="NGN 0.00"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
            required
            value={fields.price}
            onChange={(e) => {
              const numericPrice = e.target.value.replace(/[^0-9.]/g, "");
              setFields((prevFields) => ({
                ...prevFields,
                price: numericPrice,
              }));
            }}
            onBlur={(e) => {
              const formattedPrice = formatPrice(fields.Price);
              setFields((prevFields) => ({
                ...prevFields,
                price: formattedPrice,
              }));
            }}
          />
        </div>

        <div className="w-1/2">
          <label
            htmlFor="inspectionFee"
            className="block text-gray-800 font-medium mb-3"
          >
            Inspection Fee
          </label>
          <input
            type="text"
            id="inspectionFee"
            name="inspectionFee"
            placeholder="NGN 0.00"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
            value={fields.inspectionFee || ""} // Ensure it always has a string value
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9.]/g, "");
              setFields((prevFields) => ({
                ...prevFields,
                inspectionFee: numericValue, // Allow empty strings during editing
              }));
            }}
            onBlur={(e) => {
              const numericValue = parseFloat(fields.inspectionFee) || 0;
              const formattedPrice =
                numericValue > 0 ? formatPrice(numericValue) : ""; // Format valid values
              setFields((prevFields) => ({
                ...prevFields,
                inspectionFee: formattedPrice, // Always a string, even if empty
              }));
            }}
          />
        </div>
      </div>

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
          aria-label="Upload images for your property listing (Maximum 7 images)"
        />

        {imagesToDisplay.length > 0 && (
          <div className="flex gap-4 mt-4 flex-wrap">
            {imagesToDisplay.map((imageData) => (
              <div
                key={
                  imageData.isExisting
                    ? `existing-${imageData.index}`
                    : `new-${imageData.index}`
                }
                className="relative w-28 h-28 rounded-lg border border-gray-300 overflow-hidden"
              >
                <img
                  src={imageData.url}
                  alt={`Image ${imageData.index}`}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  onClick={() =>
                    handleImageRemove(imageData.index, imageData.isExisting)
                  }
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="bg-gray-500 text-white px-6 py-3 rounded-lg transition hover:bg-gray-600"
          onClick={() => setShowForm(false)}
          // create  a function for onCancel that routes back to the page that was open
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary-500 text-white px-6 py-3 rounded-lg transition hover:bg-primary-600"
        >
          {isButtonLoading ? <ButtonSpinner /> : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default PropertyEditForm;
