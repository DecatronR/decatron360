"use client";
import FavoriteButton from "../../../components/SingleProperty/FavoriteButton";
import PropertyDetails from "../../../components/SingleProperty/PropertyDetails";
import PropertyImages from "../../../components/SingleProperty/PropertyImages";
import ShareButtons from "../../../components/SingleProperty/ShareButtons";
import Spinner from "@/components/Spinner";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import AgentProfileCard from "@/components/AgentProfile/AgentProfileCard";
import ScheduleInspectionForm from "../../../components/SingleProperty/ScheduleInspectionForm";
import { fetchPropertyData } from "@/utils/api/properties/fetchPropertyData";
import { fetchUserData } from "@/utils/api/user/fetchUserData";

const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [agentId, setAgentId] = useState("");
  const [agentData, setAgentData] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleFetchPropertyData = async () => {
      if (!id) return;
      try {
        const res = await fetchPropertyData(id);
        console.log("property agent id: ", res);
        setProperty(res);
        setAgentId(res.data.userID);
        console.log("Agent Id: ", res.data.userID);
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
        console.log("Agent data: ", res);
        setAgentData(res);
      } catch (error) {
        console.log("Failed to fethc agent data");
      }
    };
    handleFetchAgent();
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
                  <AgentProfileCard agent={agentData} />
                </Link>
                <div className="space-y-4">
                  <FavoriteButton property={property} />
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
