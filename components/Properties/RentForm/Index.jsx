"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Spinner from "components/ui/Spinner";
import ButtonSpinner from "components/ui/ButtonSpinner";
import { useSnackbar } from "notistack";
import { createPropertyListing } from "@/utils/api/propertyListing/createPropertyListing";
import { fetchUserData } from "utils/api/user/fetchUserData";
import { fetchListingTypes } from "@/utils/api/propertyListing/fetchListingTypes";
import Description from "./Description";
import Location from "./Location";
import Features from "./Features";
import Pricing from "./Pricing";
import Media from "./Media";
import { fetchAllUser } from "utils/api/user/fetchAllUsers";

const RentForm = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState([]);
  const [listingTypes, setListingTypes] = useState([]);
  const [userRole, setUserRole] = useState();
  const [loading, setLoading] = useState(true);
  const [isbuttonLoading, setIsButtonLoading] = useState(false);

  const [fields, setFields] = useState({
    userID: "",
    title: "",
    listingType: "",
    usageType: "",
    propertyType: "",
    propertySubType: "null",
    propertyCondition: "",
    state: "",
    lga: "",
    neighbourhood: "",
    houseNoStreet: "",
    size: "",
    propertyDetails: "",
    bedrooms: "",
    bathrooms: "",
    price: "",
    inspectionFee: "",
    cautionFee: "",
    agencyFee: "",
    latePaymentFee: "",
    virtualTour: "",
    video: "",
    photo: [],
    titleDocument: "",
  });

  //prefill userId
  useEffect(() => {
    const loadUserId = async () => {
      const id = sessionStorage.getItem("userId");
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

  //fech all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchAllUser();
        setUsers(res);
      } catch (error) {
        console.error("Failed to fetch all users:", error);
      }
    };

    fetchUsers();
  }, []);

  //fetch user role
  useEffect(() => {
    const id = sessionStorage.getItem("userId");
    const handleFetchUserRole = async () => {
      try {
        const res = await fetchUserData(id);
        setUserRole(res.role);
      } catch (error) {
        console.log("Failed to fetch user role");
      }
    };
    handleFetchUserRole();
  }, []);

  //fetch listing types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetchListingTypes();
        setListingTypes(res);
      } catch (error) {
        console.error("Failed to fetch listing types:", error);
        enqueueSnackbar("Failed to fetch listing types", { variant: "error" });
      }
    };

    fetchTypes();
  }, [enqueueSnackbar]);

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
    formData.append("houseNoStreet", fields.houseNoStreet);
    formData.append("size", fields.size);
    formData.append("propertyDetails", fields.propertyDetails);
    formData.append("bedrooms", fields.bedrooms);
    formData.append("bathrooms", fields.bathrooms);
    formData.append("price", fields.price);
    formData.append("inspectionFee", fields.inspectionFee);
    formData.append("cautionFee", fields.cautionFee);
    formData.append("agencyFee", fields.agencyFee);
    formData.append("latePaymentFee", fields.latePaymentFee);
    formData.append("virtualTour", fields.virtualTour);
    formData.append("video", fields.video);
    formData.append("titleDocument", fields.titleDocument);

    // Append image files (each file)
    fields.photo.forEach((photo, index) => {
      formData.append(`photo`, photo);
    });

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
        className="space-y-6 bg-white shadow-lg rounded-none sm:rounded-xl p-6 max-w-3xl w-full mx-auto border border-gray-200 sm:p-6"
      >
        <h2 className="text-2xl text-center font-bold mb-10 text-gray-900 sm:text-xl">
          Add Property For{" "}
          {fields.listingType
            ? listingTypes.find((type) => type.slug === fields.listingType)
                ?.listingType
            : "...."}
        </h2>

        {userRole === "admin" && (
          <div className="mb-6">
            <label
              htmlFor="userID"
              className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base"
            >
              User
            </label>
            <select
              id="userID"
              name="userID"
              className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition text-sm sm:text-base"
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

        {/* Listing Type Selection */}
        <div className="mb-6">
          <label
            htmlFor="listingType"
            className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base"
          >
            Listing Type
          </label>
          <select
            id="listingType"
            name="listingType"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition text-sm sm:text-base"
            required
            value={fields.listingType}
            onChange={handleChange}
          >
            <option disabled value="">
              Select Listing Type
            </option>
            {listingTypes.map((type) => (
              <option key={type._id} value={type.slug}>
                {type.listingType}
              </option>
            ))}
          </select>
        </div>

        {/* Responsive Section Wrappers */}
        <div className="bg-gray-50  rounded-lg shadow-sm ">
          <Description fields={fields} handleChange={handleChange} />
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm ">
          <Location fields={fields} handleChange={handleChange} />
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm ">
          <Features fields={fields} handleChange={handleChange} />
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm">
          <Pricing fields={fields} setFields={setFields} />
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm">
          <Media
            fields={fields}
            handleChange={handleChange}
            setFields={setFields}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-3 rounded-full transition hover:bg-primary-700 shadow-md flex items-center justify-center w-full sm:w-auto"
          >
            {isbuttonLoading ? <ButtonSpinner /> : "Submit"}
          </button>
        </div>
      </form>
    )
  );
};

export default RentForm;
