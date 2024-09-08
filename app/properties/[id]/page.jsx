"use client";
import axios from "axios";
import BookmarkButton from "@/components/singleProperty/BookmarkButton";
import PropertyDetails from "@/components/singleProperty/PropertyDetails";
import PropertyImages from "@/components/singleProperty/PropertyImages";
import ShareButtons from "@/components/singleProperty/ShareButtons";
import Spinner from "@/components/Spinner";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileCard from "@/components/agentProfile/ProfileCard";
import ScheduleInspectionForm from "@/components/singleProperty/ScheduleInspectionForm";

const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const agent = {
    photo: "/path/to/agent-photo.jpg",
    name: "John Doe",
    rank: "Top Agent",
    reviews: 123,
    ratings: 456,
    joinDate: "2020-01-15",
  };

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;
      try {
        const property = await axios.post(
          "http://localhost:8080/propertyListing/editPropertyListing",
          { id },
          { withCredentials: true }
        );
        setProperty(property.data);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!property) {
      fetchPropertyData();
    }
  }, [id, property]);

  if (!property && !loading) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">
        Property Not Found
      </h1>
    );
  }

  return (
    <>
      {loading && <Spinner />}
      {!loading && property && (
        <>
          {/* Header with image carousel */}
          <PropertyImages images={property.photos} />

          {/* Main content: property details and sticky sidebar */}
          <div className="container mx-auto py-6 px-6">
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0">
              <div className="flex-1 bg-white p-6 rounded-lg ">
                {/* Property details */}
                <PropertyDetails property={property.data} />
              </div>

              {/* Sidebar */}
              <aside className="w-full md:w-1/3 sticky top-4 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                  <ProfileCard agent={agent} />
                  <BookmarkButton property={property} />
                  <ShareButtons property={property} />
                </div>

                <div>
                  <ScheduleInspectionForm />
                </div>
              </aside>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PropertyPage;
