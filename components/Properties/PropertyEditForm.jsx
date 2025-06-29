"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "components/ui/Spinner";
import ButtonSpinner from "components/ui/ButtonSpinner";
import { useSnackbar } from "notistack";
import { editPropertyListing } from "@/utils/api/propertyListing/editPropertyListing";
import { updatePropertyListing } from "@/utils/api/propertyListing/updatePropertyListing";
import Description from "./RentForm/Description";
import Location from "./RentForm/Location";
import Features from "./RentForm/Features";
import Pricing from "./RentForm/Pricing";
import Media from "./RentForm/Media";

const PropertyEditForm = ({ propertyId }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [propertyData, setPropertyData] = useState({});
  const [fields, setFields] = useState({
    id: "",
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

  // Load property data for editing
  useEffect(() => {
    const loadPropertyData = async () => {
      try {
        const res = await editPropertyListing(propertyId);
        setPropertyData(res);

        // Set fields with existing property data
        setFields({
          id: res?.data?._id || "",
          title: res?.data?.title || "",
          listingType: res?.data?.listingType || "",
          usageType: res?.data?.usageType || "",
          propertyType: res?.data?.propertyType || "",
          propertySubType: res?.data?.propertySubType || "null",
          propertyCondition: res?.data?.propertyCondition || "",
          state: res?.data?.state || "",
          lga: res?.data?.lga || "",
          neighbourhood: res?.data?.neighbourhood || "",
          houseNoStreet: res?.data?.houseNoStreet || "",
          size: res?.data?.size || "",
          propertyDetails: res?.data?.propertyDetails || "",
          bedrooms: res?.data?.bedrooms || "",
          bathrooms: res?.data?.bathrooms || "",
          price: res?.data?.price || "",
          inspectionFee: res?.data?.inspectionFee || "",
          cautionFee: res?.data?.cautionFee || "",
          agencyFee: res?.data?.agencyFee || "",
          latePaymentFee: res?.data?.latePaymentFee || "",
          virtualTour: res?.data?.virtualTour || "",
          video: res?.data?.video || "",
          photo: res?.data?.photos || [],
          titleDocument: res?.data?.titleDocument || "",
        });

        setMounted(true);
        setLoading(false);
      } catch (error) {
        enqueueSnackbar("Failed to fetch property data for editing!", {
          variant: "error",
        });
        setLoading(false);
      }
    };

    if (propertyId) {
      loadPropertyData();
    }
  }, [propertyId, enqueueSnackbar]);

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

    // Handle images - separate existing images from new uploaded images
    const existingImages = propertyData?.data?.photos || [];
    const newImages = fields.photo.filter((photo) => photo instanceof File);
    const existingImageUrls = fields.photo.filter(
      (photo) => typeof photo === "string"
    );

    // Append existing images that should be kept
    existingImageUrls.forEach((imageUrl, index) => {
      formData.append(`existingImages[${index}]`, imageUrl);
    });

    // Append new uploaded images
    newImages.forEach((photo, index) => {
      formData.append(`photo`, photo);
    });

    setIsButtonLoading(true);
    try {
      await updatePropertyListing(formData);
      enqueueSnackbar("Successfully updated property!", {
        variant: "success",
      });
      router.push(`/properties/${fields.id}`);
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        enqueueSnackbar(`Failed to update property: ${errorMessage}`, {
          variant: "error",
        });
      } else {
        enqueueSnackbar(`Failed to update property: ${error.message}`, {
          variant: "error",
        });
      }
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return loading ? (
    <Spinner />
  ) : (
    mounted && (
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow-lg rounded-none sm:rounded-xl p-6 max-w-3xl w-full mx-auto border border-gray-200 sm:p-6"
      >
        <h2 className="text-2xl text-center font-bold mb-10 text-gray-900 sm:text-xl">
          Edit Property
        </h2>

        {/* Responsive Section Wrappers */}
        <div className="bg-gray-50 rounded-lg shadow-sm">
          <Description fields={fields} handleChange={handleChange} />
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm">
          <Location fields={fields} handleChange={handleChange} />
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm">
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
            existingImages={propertyData?.data?.photos || []}
            isEditMode={true}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-6 py-3 rounded-full transition hover:bg-gray-600 shadow-md flex items-center justify-center w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-3 rounded-full transition hover:bg-primary-700 shadow-md flex items-center justify-center w-full sm:w-auto"
          >
            {isButtonLoading ? <ButtonSpinner /> : "Save Changes"}
          </button>
        </div>
      </form>
    )
  );
};

export default PropertyEditForm;
