"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "../Spinner";
import ButtonSpinner from "../ButtonSpinner";
import { useSnackbar } from "notistack";
import { createPropertyListing } from "@/utils/api/propertyListing/createPropertyListing";
import { fetchUserData } from "utils/api/user/fetchUserData";

const RentForm = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [mounted, setMounted] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [lga, setLga] = useState([]);
  const [propertyCondition, setPropertyCondition] = useState([]);
  const [propertyUsage, setPropertyUsage] = useState([]);
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isbuttonLoading, setIsButtonLoading] = useState(false);

  const [fields, setFields] = useState({
    userID: "",
    title: "",
    listingType: "Rent",
    usageType: "",
    propertyType: "",
    propertySubType: "null",
    propertyCondition: "",
    state: "",
    lga: "",
    neighbourhood: "",
    size: "",
    propertyDetails: "",
    livingrooms: "null",
    bedrooms: "",
    bathrooms: "",
    parkingSpace: "null",
    price: "",
    inspectionFee: "",
    titleDocument: "",
    virtualTour: "",
    video: "",
    photo: [],
  });

  //prefill userId
  useEffect(() => {
    const loadUserId = async () => {
      const id = sessionStorage.getItem("userId");
      console.log("userId sale: ", id);
      if (id) {
        setFields((prevFields) => ({
          ...prevFields,
          userID: id,
        }));
        setMounted(true);
      }
      setLoading(false);
    };

    loadUserId();
  }, []);

  //fetch user role
  useEffect(() => {
    const id = sessionStorage.getItem("userId");
    const handleFetcUserRole = async () => {
      try {
        const res = await fetchUserData(id);
        setUserRole(res.role);
      } catch (error) {
        console.log("Failed to fetch user role");
      }
    };
    handleFetcUserRole();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if nested property
    if (name.includes(".")) {
      const [outerKey, innerKey] = name.split(".");

      setFields((prevFields) => ({
        ...prevFields,
        [outerKey]: {
          ...prevFields[outerKey],
          [innerKey]: value,
        },
      }));
    } else {
      // Not nested
      setFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
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

      // Check file size (e.g., 2MB)
      if (file.size > 5 * 1024 * 1024) {
        enqueueSnackbar(`${file.name} is too large, maximum file size is 5MB`, {
          variant: "error",
        });
        continue;
      }

      // Check file type (e.g., only allow image/jpeg or image/png)
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

    // Update the actual files in fields
    setFields((prevFields) => ({
      ...prevFields,
      photo: [...prevFields.photo, ...newImages],
    }));
  };

  const handleImageRemove = (index) => {
    // Revoke the URL to free memory
    URL.revokeObjectURL(previewUrls[index]);

    // Remove the image from preview and fields
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));

    // Update the fields.photo array to remove the corresponding file
    setFields((prevFields) => ({
      ...prevFields,
      photo: prevFields.photo.filter((_, i) => i !== index),
    }));
  };

  const formatPrice = (price) => {
    if (typeof price !== "string") {
      price = String(price); // Convert to string if it's not already
    }

    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(numericPrice || 0); // Fallback to 0 if parsing fails
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
        //fetch users list for admin to select
        fetchData(`${baseUrl}/users/getusers`, setUsers),
      ]);
    };

    fetchAllData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append text fields
    formData.append("userID", fields.userID);
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
    formData.append("livingrooms", fields.livingrooms);
    formData.append("bedrooms", fields.bedrooms);
    formData.append("bathrooms", fields.bathrooms);
    formData.append("parkingSpace", fields.parkingSpace);
    formData.append("price", fields.price);
    formData.append("inspectionFee", fields.inspectionFee);
    formData.append("titleDocument", fields.titleDocument);
    formData.append("virtualTour", fields.virtualTour);
    formData.append("video", fields.video);

    // Append image files (each file)
    fields.photo.forEach((photo, index) => {
      formData.append(`photo`, photo);
    });

    console.log("Creating new property listing with formData: ", formData);
    setIsButtonLoading(true);
    const userId = sessionStorage.getItem("userId");
    try {
      await createPropertyListing(formData);
      enqueueSnackbar("Successfully listed new property!", {
        variant: "success",
      });
      router.push(`/user-properties/${userId}`);
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        enqueueSnackbar(`Failed to list new property: ${errorMessage}`, {
          variant: "error",
        });
      } else {
        enqueueSnackbar(`Failed to list new property: ${error.message}`, {
          variant: "error",
        });
      }
    } finally {
      setIsButtonLoading(false);
    }
  };

  return loading ? (
    <Spinner />
  ) : (
    mounted && (
      <form
        data-testid="rent-form"
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow-md rounded-lg p-6"
      >
        <h2 className="text-4xl text-center font-bold mb-8 text-gray-800">
          Add Property For Rent
        </h2>

        {userRole === "admin" && (
          <div className="mb-6">
            <label
              htmlFor="userID"
              className="block text-gray-800 font-medium mb-3"
            >
              User
            </label>
            <select
              id="userID"
              name="userID"
              className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
              required
              value={fields.userID}
              onChange={handleChange}
            >
              <option disabled value="">
                Select User
              </option>
              {users.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        )}

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
          <label
            htmlFor="title"
            className="block text-gray-800 font-medium mb-3"
          >
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
            required
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
          <label className="block text-gray-800 font-medium mb-3">
            Location
          </label>
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
              required
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
              required
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
                const formattedPrice = formatPrice(fields.price);
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
          <label
            htmlFor="video"
            className="block text-gray-800 font-medium mb-3"
          >
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
          <label
            htmlFor="photo"
            className="block text-gray-800 font-medium mb-3"
          >
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

        <div className="flex justify-end gap-4">
          {/* <button
            type="button"
            className="bg-gray-500 text-white px-6 py-3 rounded-lg transition hover:bg-gray-600"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button> */}
          <button
            type="submit"
            className="bg-primary-500 text-white px-6 py-3 rounded-lg transition hover:bg-primary-600"
          >
            {isbuttonLoading ? <ButtonSpinner /> : "Add Property"}
          </button>
        </div>
      </form>
    )
  );
};

export default RentForm;
