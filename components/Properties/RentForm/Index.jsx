"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Spinner from "components/ui/Spinner";
import ButtonSpinner from "components/ui/ButtonSpinner";
import { useSnackbar } from "notistack";
import { createPropertyListing } from "@/utils/api/propertyListing/createPropertyListing";
import { fetchUserData } from "utils/api/user/fetchUserData";
import Description from "./Description";
import Location from "./Location";
import Features from "./Features";
import Pricing from "./Pricing";
import Media from "./Media";
import { fetchAllUser } from "utils/api/user/fetchAllUsers";

const RentForm = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [mounted, setMounted] = useState(false);
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
          Add Property For Rent
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
          <Pricing fields={fields} />
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm">
          <Media
            fields={fields}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
            handleImageRemove={handleImageRemove}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6 sm:flex-col sm:items-center">
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
