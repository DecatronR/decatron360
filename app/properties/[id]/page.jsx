"use client";

import FavoriteButton from "../../../components/Property/FavoriteButton";
import AgentRequestButton from "components/Property/AgentRequestButton";
import PropertyDetails from "../../../components/Property/PropertyDetails";
import PropertyImages from "../../../components/Property/PropertyImages";
import ShareButtons from "../../../components/Property/ShareButtons";
import Spinner from "@/components/Spinner";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import AgentProfileCard from "@/components/AgentProfile/AgentProfileCard";
import ScheduleInspectionForm from "../../../components/Property/ScheduleInspectionForm";
import { fetchPropertyData } from "@/utils/api/properties/fetchPropertyData";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import { fetchUserRatingAndReviews } from "utils/api/user/fetchUserRatingAndReviews";

const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [agentId, setAgentId] = useState("");
  const [agentData, setAgentData] = useState("");
  const [agentRating, setAgentRating] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState();

  useEffect(() => {
    const handleFetchUser = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) return;

        const userData = await fetchUserData(userId);
        setUserRole(userData.role);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    handleFetchUser();
  }, []);

  useEffect(() => {
    const handleFetchPropertyData = async () => {
      if (!id) return;
      try {
        const res = await fetchPropertyData(id);
        setProperty(res);
        setAgentId(res.data.userID);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!property) {
      handleFetchPropertyData();
    }
  }, [id, property]);

  useEffect(() => {
    const handleFetchAgent = async () => {
      try {
        const res = await fetchUserData(agentId);
        setAgentData(res);
      } catch (error) {
        console.log("Failed to fetch agent data");
      }
    };
    handleFetchAgent();
  }, [agentId]);

  useEffect(() => {
    const handleFetchAgentRating = async () => {
      if (agentId) {
        try {
          const res = await fetchUserRatingAndReviews(agentId);
          setAgentRating(res.averageRating || 0);
        } catch (error) {
          console.log("Issues fetching agent rating: ", error);
        }
      } else {
        console.log("Could not fetch agent reviews, user id not found");
      }
    };
    handleFetchAgentRating();
  }, [agentId]);

  if (!property && !isLoading) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">
        Property Not Found
      </h1>
    );
  }

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && property && (
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
                  agentId={property.data.userID}
                />
              </div>

              {/* Sticky Sidebar */}
              <aside className="w-full md:w-1/3 sticky top-4 h-fit">
                <Link href={`/agent-profile/${agentId}`}>
                  <AgentProfileCard
                    agentData={agentData}
                    agentRating={agentRating}
                  />
                </Link>
                <div className="space-y-4">
                  <FavoriteButton property={property} />
                  {userRole === "agent" && <AgentRequestButton />}

                  <ShareButtons property={property} />
                </div>
                {agentId && (
                  <ScheduleInspectionForm propertyId={id} agentId={agentId} />
                )}
              </aside>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PropertyPage;
