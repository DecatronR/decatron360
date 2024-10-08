"use client";
import axios from "axios";
import BookmarkButton from "@/components/SingleProperty/BookmarkButton";
import FavoriteButton from "@/components/SingleProperty/BookmarkButton";
import PropertyDetails from "@/components/SingleProperty/PropertyDetails";
import PropertyImages from "@/components/SingleProperty/PropertyImages";
import ShareButtons from "@/components/SingleProperty/ShareButtons";
import Spinner from "@/components/Spinner";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import AgentProfileCard from "@/components/AgentProfile/AgentProfileCard";
import ScheduleInspectionForm from "@/components/SingleProperty/ScheduleInspectionForm";
import { fetchPropertyData } from "@/utils/api/properties/fetchPropertyData";

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
    const handleFetchPropertyData = async () => {
      if (!id) return;
      try {
        const res = await fetchPropertyData(id);
        console.log("property agent id: ", res);
        setProperty(res);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!property) {
      handleFetchPropertyData();
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
          <div className="container mx-auto py-8 px-4 md:px-4">
            <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
              {/* Scrollable Property details */}
              <div className="flex-1 bg-white shadow-lg rounded-lg p-0 md:p-6 h-screen overflow-y-auto">
                <PropertyDetails
                  property={property.data}
                  userId={property.data.userID}
                />
              </div>

              {/* Sticky Sidebar */}
              <aside className="w-full md:w-1/3 sticky top-4 h-fit">
                <Link href={`/agent-profile/${property.data.userID}`}>
                  <AgentProfileCard agent={agent} />
                </Link>
                <div className="space-y-4">
                  <FavoriteButton property={property} />
                  <ShareButtons property={property} />
                </div>
                <ScheduleInspectionForm propertyId={id} />
              </aside>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PropertyPage;
