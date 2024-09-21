"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserInspectionDetails from "@/components/inspection/UserInspectionDetails";
import PropertyInspectionDetails from "@/components/inspection/PropertyInspectionDetails";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const InspectionDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = searchParams.get("id");

  console.log("ID: ", id);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;

      try {
        const response = await axios.post(
          "http://localhost:8080/propertyListing/editPropertyListing",
          { id },
          { withCredentials: true }
        );
        console.log("Property data:", response.data);
        setProperty(response.data);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyData();
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex space-x-4">
      <div className="flex-1">
        <UserInspectionDetails property={property} />
      </div>
      <div className="flex-1">
        <PropertyInspectionDetails property={property} />
      </div>
    </div>
  );
};

export default InspectionDetails;
