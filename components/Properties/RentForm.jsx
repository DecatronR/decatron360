"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const RentForm = () => {
  const [mounted, setMounted] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [lga, setLga] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [fields, setFields] = useState({
    userID: "",
    title: "",
    listingType: "rent",
    usageType: "dummyData",
    propertyType: "",
    propertySubType: "dummyData",
    propertyCondition: "dummyData",
    state: "",
    lga: "",
    neighbourhood: "",
    size: "",
    propertyDetails: "",
    NoOfLivingRooms: "1",
    NoOfBedRooms: "",
    NoOfKitchens: "",
    NoOfParkingSpace: "2",
    Price: "",
    virtualTour: "",
    video: "",
    photo: [],
  });

  useEffect(() => {
    const id = sessionStorage.getItem("userId");
    console.log("userId sale: ", id);
    if (id) {
      setFields((prevFields) => ({
        ...prevFields,
        userID: id,
      }));
      setMounted(true);
    }
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
  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;

    // Clone the current array
    const updatedAmenites = [...fields.amenities];

    if (checked) {
      // Add value to array
      updatedAmenites.push(value);
    } else {
      // Remove value from array
      const index = updatedAmenites.indexOf(value);

      if (index !== -1) {
        updatedAmenites.splice(index, 1);
      }
    }

    // Update state with updated array
    setFields((prevFields) => ({
      ...prevFields,
      amenities: updatedAmenites,
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
      newImages.push(files[i]);
      newPreviewUrls.push(URL.createObjectURL(files[i]));
    }

    setUploadedImages([...uploadedImages, ...newImages]);
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    const newPhotos = [
      ...fields.photo,
      ...newImages.map((file) => ({ path: URL.createObjectURL(file) })),
    ];
    setFields((prevFields) => ({ ...prevFields, photo: newPhotos }));
  };

  const removeImage = (index) => {
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);

    const newUploadedImages = [...uploadedImages];
    newUploadedImages.splice(index, 1);
    setUploadedImages(newUploadedImages);

    const newPhotos = [...fields.photo];
    newPhotos.splice(index, 1);
    setFields((prevFields) => ({ ...prevFields, photo: newPhotos }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const fetchData = useCallback(async (url, setter) => {
    try {
      const res = await axios.get(url, { withCredentials: true });
      console.log(`Successfully fetched data from ${url}: `, res);
      const data = res.data;
      console.log("Data: ", data);
      setter(data);
    } catch (err) {
      console.log(`Issue fetching data from ${url}`);
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchData(
          "http://localhost:8080/propertyType/fetchPropertyType",
          setPropertyTypes
        ),
        fetchData("http://localhost:8080/state/fetchState", setStates),
        fetchData("http://localhost:8080/lga/fetchLGA", setLga),
      ]);
    };

    fetchAllData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const createListingConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:8080/propertyListing/createPropertyListing",
      headers: {},
      data: fields,
      withCredentials: true,
    };

    console.log("Creating new property listing with data: ", fields);
    try {
      const res = await axios(createListingConfig);
      console.log("Successfully created listing type: ", res);
    } catch (error) {
      console.log("Issue with creating new property listing: ", error);
    }
  };

  return (
    mounted && (
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow-md rounded-lg p-6"
      >
        <h2 className="text-4xl text-center font-bold mb-8 text-gray-800">
          Add Property For Sale
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
          <div className="space-y-4">
            <select
              id="state"
              name="state"
              className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
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
              className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
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
              className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
              placeholder="Neighbourhood"
              value={fields.neighbourhood}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-1/3">
            <label
              htmlFor="beds"
              className="block text-gray-800 font-medium mb-3"
            >
              Beds
            </label>
            <input
              type="number"
              id="NoOfBedRooms"
              name="NoOfBedRooms"
              className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
              required
              value={fields.NoOfBedRooms}
              onChange={handleChange}
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label
              htmlFor="baths"
              className="block text-gray-800 font-medium mb-3"
            >
              Baths
            </label>
            <input
              type="number"
              id="NoOfKitchens"
              name="NoOfKitchens"
              className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
              required
              value={fields.NoOfKitchens}
              onChange={handleChange}
            />
          </div>

          <div className="w-full sm:w-1/3">
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
              required
              value={fields.size}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="price"
            className="block text-gray-800 font-medium mb-3"
          >
            Price
          </label>
          <input
            type="text"
            id="Price"
            name="Price"
            placeholder="NGN 0.00"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 transition"
            required
            value={fields.Price}
            onChange={handleChange}
            onBlur={(e) => {
              const formattedPrice = formatPrice(fields.Price);
              setFields((prevFields) => ({
                ...prevFields,
                Price: formattedPrice,
              }));
            }}
          />
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
            required
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
            Add Property
          </button>
        </div>
      </form>
    )
  );
};

export default RentForm;
