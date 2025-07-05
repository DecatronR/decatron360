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
import Swal from "sweetalert2";
import { Home, Plus, Upload, Settings } from "lucide-react";

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

      // Show SweetAlert2 confirmation dialog with three options
      const result = await Swal.fire({
        title: "Property Listed Successfully! 🎉",
        html: `
          <div class="text-left">
            <p class="text-gray-600 mb-4">Your property has been successfully listed. What would you like to do next?</p>
            <div class="space-y-3">
              <div class="flex items-center p-3 bg-blue-50 rounded-lg">
                <div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-3">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </div>
                <span class="text-sm font-medium text-blue-900">View your property listings</span>
              </div>
              <div class="flex items-center p-3 bg-orange-50 rounded-lg">
                <div class="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full mr-3">
                  <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span class="text-sm font-medium text-orange-900">Set inspection availability</span>
              </div>
              <div class="flex items-center p-3 bg-green-50 rounded-lg">
                <div class="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mr-3">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <span class="text-sm font-medium text-green-900">Create another listing</span>
              </div>
            </div>
          </div>
        `,
        icon: "success",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "View Listings",
        denyButtonText: "Set Availability",
        cancelButtonText: "Create Another",
        confirmButtonColor: "#3B82F6",
        denyButtonColor: "#F97316",
        cancelButtonColor: "#10B981",
        reverseButtons: true,
        customClass: {
          popup: "rounded-2xl",
          title: "text-xl font-semibold text-gray-900",
          content: "text-gray-600",
          confirmButton: "rounded-xl px-6 py-3 font-medium",
          denyButton: "rounded-xl px-6 py-3 font-medium",
          cancelButton: "rounded-xl px-6 py-3 font-medium",
        },
      });

      if (result.isConfirmed) {
        // User clicked "View Listings" - redirect to their property listings page
        router.push(`/user-properties/${userId}`);
      } else if (result.isDenied) {
        // User clicked "Set Availability" - redirect to scheduler page
        router.push(`/agent-scheduler/${userId}`);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User clicked "Create Another" - reset form and stay on page
        setFields({
          userID: fields.userID, // Keep the userID
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
        // Scroll to top of form
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  return (
    mounted && (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <Plus className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              List Your Property
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              {fields.listingType
                ? `Add a new ${
                    listingTypes.find(
                      (type) => type.slug === fields.listingType
                    )?.listingType
                  } to your portfolio`
                : "Tell us about your property and we'll help you list it"}
            </p>
          </div>

          <form
            data-testid="rent-form"
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Admin User Selection */}
            {userRole === "admin" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mr-4">
                    <Settings className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Select User
                  </h2>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="userID"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Property Owner
                  </label>
                  <select
                    id="userID"
                    name="userID"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                    required
                    value={fields.userID}
                    onChange={handleChange}
                  >
                    <option disabled value="">
                      Select the property owner
                    </option>
                    {users.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Listing Type Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mr-4">
                  <Home className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Listing Type
                </h2>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="listingType"
                  className="block text-sm font-medium text-gray-700"
                >
                  How would you like to list this property?
                </label>
                <select
                  id="listingType"
                  name="listingType"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                  required
                  value={fields.listingType}
                  onChange={handleChange}
                >
                  <option disabled value="">
                    Select listing type
                  </option>
                  {listingTypes.map((type) => (
                    <option key={type._id} value={type.slug}>
                      {type.listingType}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Form Sections */}
            <Description fields={fields} handleChange={handleChange} />
            <Location fields={fields} handleChange={handleChange} />
            <Features fields={fields} handleChange={handleChange} />
            <Pricing fields={fields} setFields={setFields} />
            <Media
              fields={fields}
              handleChange={handleChange}
              setFields={setFields}
            />

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isbuttonLoading}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl disabled:shadow-md flex items-center space-x-2"
              >
                {isbuttonLoading ? (
                  <>
                    <ButtonSpinner />
                    <span>Creating Listing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Create Listing</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default RentForm;
