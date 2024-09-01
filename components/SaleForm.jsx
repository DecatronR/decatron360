"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const SaleForm = () => {
  const [mounted, setMounted] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [lga, setLga] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const [fields, setFields] = useState({
    listingType: "sale",
    propertyType: "",
    name: "",
    description: "",
    location: {
      state: "",
      lga: "",
      neighbourhood: "",
      street: "",
      zipcode: "",
    },
    beds: "",
    baths: "",
    size: "",
    amenities: [],
    price: "",
    virtualTour: "",
    video: "",
    images: [],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      // Check if nested property
      const [outerKey, innerKey] = name.split(".");

      setFields((prevFields) => ({
        ...prevFields,
        [outerKey]: {
          ...prevFields[outerKey],
          [innerKey]: value,
        },
      }));
    } else {
      if (name === "price") {
        // Handle price input field as a raw number
        const rawPrice = value.replace(/[^0-9.]/g, ""); // Keep only numbers and dots
        setFields((prevFields) => ({ ...prevFields, price: rawPrice }));
      } else {
        setFields((prevFields) => ({
          ...prevFields,
          [name]: value,
        }));
      }
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

    // Convert file objects to URLs
    const imagePreviews = files.map((file) => URL.createObjectURL(file));

    setSelectedImages(imagePreviews);
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

  return (
    mounted && (
      <form
        action="/api/properties"
        method="POST"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl text-center font-semibold mb-6">
          Add Property For Sale
        </h2>

        <div className="mb-4">
          <label
            htmlFor="propertyType"
            className="block text-gray-700 font-bold mb-2"
          >
            Property Type
          </label>
          <select
            id="propertyType"
            name="propertyType"
            className="border rounded w-full py-2 px-3"
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
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Listing Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="eg. Beautiful Apartment In Miami"
            required
            value={fields.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="border rounded w-full py-2 px-3"
            rows="4"
            placeholder="Add an optional description of your property"
            value={fields.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-4 bg-blue-50 p-4">
          <label className="block text-gray-700 font-bold mb-2">Location</label>
          <select
            id="state"
            name="state"
            className="border rounded w-full py-2 px-3 mb-2"
            required
            value={fields.city}
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
            className="border rounded w-full py-2 px-3 mb-2"
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
            name="location.neighbourhood"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="Neighbourhood"
            value={fields.location.neighbourhood}
            onChange={handleChange}
          />
          <input
            type="text"
            id="street"
            name="location.street"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="Street"
            value={fields.location.street}
            onChange={handleChange}
          />
          <input
            type="text"
            id="zipcode"
            name="location.zipcode"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="Zipcode"
            value={fields.location.zipcode}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4 flex flex-wrap">
          <div className="w-full sm:w-1/3 pr-2">
            <label
              htmlFor="beds"
              className="block text-gray-700 font-bold mb-2"
            >
              Beds
            </label>
            <input
              type="number"
              id="beds"
              name="beds"
              className="border rounded w-full py-2 px-3"
              required
              value={fields.beds}
              onChange={handleChange}
            />
          </div>
          <div className="w-full sm:w-1/3 px-2">
            <label
              htmlFor="baths"
              className="block text-gray-700 font-bold mb-2"
            >
              Baths
            </label>
            <input
              type="number"
              id="baths"
              name="baths"
              className="border rounded w-full py-2 px-3"
              required
              value={fields.baths}
              onChange={handleChange}
            />
          </div>
          <div className="w-full sm:w-1/3 pl-2">
            <label
              htmlFor="size"
              className="block text-gray-700 font-bold mb-2"
            >
              Size
            </label>
            <input
              type="number"
              id="size"
              name="size"
              placeholder="Square Meter (Sqm)"
              className="border rounded w-full py-2 px-3"
              required
              value={fields.size}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div>
              <input
                type="checkbox"
                id="amenity_wifi"
                name="amenities"
                value="Wifi"
                className="mr-2"
                checked={fields.amenities.includes("Wifi")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_wifi">Wifi</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_kitchen"
                name="amenities"
                value="Full Kitchen"
                className="mr-2"
                checked={fields.amenities.includes("Full Kitchen")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_kitchen">Full kitchen</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_washer_dryer"
                name="amenities"
                value="Washer & Dryer"
                className="mr-2"
                checked={fields.amenities.includes("Washer & Dryer")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_washer_dryer">Washer & Dryer</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_free_parking"
                name="amenities"
                value="Free Parking"
                className="mr-2"
                checked={fields.amenities.includes("Free Parking")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_free_parking">Free Parking</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_pool"
                name="amenities"
                value="Swimming Pool"
                className="mr-2"
                checked={fields.amenities.includes("Swimming Pool")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_pool">Swimming Pool</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_hot_tub"
                name="amenities"
                value="Hot Tub"
                className="mr-2"
                checked={fields.amenities.includes("Hot Tub")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_hot_tub">Hot Tub</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_24_7_security"
                name="amenities"
                value="24/7 Security"
                className="mr-2"
                checked={fields.amenities.includes("24/7 Security")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_24_7_security">24/7 Security</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_wheelchair_accessible"
                name="amenities"
                value="Wheelchair Accessible"
                className="mr-2"
                checked={fields.amenities.includes("Wheelchair Accessible")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_wheelchair_accessible">
                Wheelchair Accessible
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_elevator_access"
                name="amenities"
                value="Elevator Access"
                className="mr-2"
                checked={fields.amenities.includes("Elevator Access")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_elevator_access">Elevator Access</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_dishwasher"
                name="amenities"
                value="Dishwasher"
                className="mr-2"
                checked={fields.amenities.includes("Dishwasher")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_dishwasher">Dishwasher</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_gym_fitness_center"
                name="amenities"
                value="Gym/Fitness Center"
                className="mr-2"
                checked={fields.amenities.includes("Gym/Fitness Center")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_gym_fitness_center">
                Gym/Fitness Center
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_air_conditioning"
                name="amenities"
                value="Air Conditioning"
                className="mr-2"
                checked={fields.amenities.includes("Air Conditioning")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_air_conditioning">Air Conditioning</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_balcony_patio"
                name="amenities"
                value="Balcony/Patio"
                className="mr-2"
                checked={fields.amenities.includes("Balcony/Patio")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_balcony_patio">Balcony/Patio</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_smart_tv"
                name="amenities"
                value="Smart TV"
                className="mr-2"
                checked={fields.amenities.includes("Smart TV")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_smart_tv">Smart TV</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_coffee_maker"
                name="amenities"
                value="Coffee Maker"
                className="mr-2"
                checked={fields.amenities.includes("Coffee Maker")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_coffee_maker">Coffee Maker</label>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-700 font-bold mb-2"
            >
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              placeholder="NGN 0.00"
              className="border rounded w-full py-2 px-3"
              required
              value={fields.price}
              onChange={handleChange}
              onBlur={(e) => {
                const formattedPrice = formatPrice(fields.price);
                setFields((prevFields) => ({
                  ...prevFields,
                  price: formattedPrice,
                }));
              }}
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="virtual_tour"
            className="block text-gray-700 font-bold mb-2"
          >
            Virtual Tour
          </label>
          <input
            type="text"
            id="virtual_tour"
            name="virtual_tour"
            className="border rounded w-full py-2 px-3"
            placeholder="https://my.matterport.com/show/?m=virtual-tour-id"
            value={fields.virtualTour}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="seller_email"
            className="block text-gray-700 font-bold mb-2"
          >
            Video
          </label>
          <input
            type="text"
            id="video"
            name="video"
            className="border rounded w-full py-2 px-3"
            placeholder="https://www.youtube.com/watch?v=video-id"
            required
            value={fields.video}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-4">
            <label
              htmlFor="images"
              className="block text-gray-700 font-bold mb-2"
            >
              Images (Select up to 4 images)
            </label>
            <input
              type="file"
              id="images"
              name="images"
              className="border rounded w-full py-2 px-3"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
            />
          </div>

          {selectedImages.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-16 h-16 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add Property
          </button>
        </div>
      </form>
    )
  );
};

export default SaleForm;
