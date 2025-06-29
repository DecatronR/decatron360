"use client";
import { useRouter } from "next/navigation";
import FavoriteButton from "../../../components/Property/FavoriteButton";
import AgencyRequestButton from "components/Property/AgencyRequestButton";
import PropertyDetails from "../../../components/Property/PropertyDetails";
import PropertyImages from "../../../components/Property/PropertyImages";
import ShareButtons from "../../../components/Property/ShareButtons";
import Spinner from "components/ui/Spinner";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import AgentProfileCard from "@/components/AgentProfile/AgentProfileCard";
import ScheduleInspectionForm from "../../../components/Property/ScheduleInspectionForm";
import { fetchPropertyData } from "@/utils/api/properties/fetchPropertyData";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import { fetchUserRatingAndReviews } from "utils/api/user/fetchUserRatingAndReviews";
import ProceedToRent from "components/Property/ProceedToRent";
import { fetchUserBookings } from "utils/api/inspection/fetchUserBookings";
import { createContract } from "utils/api/contract/createContract";
import { useAuth } from "context/AuthContext";

const PropertyPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [agentId, setAgentId] = useState("");
  const [agentData, setAgentData] = useState("");
  const [agentRating, setAgentRating] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState();
  const [listerRole, setListerRole] = useState();
  const [referralCode, setReferralCode] = useState();
  const [userBookings, setUserBookings] = useState([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const refCode = searchParams.get("ref");

    if (refCode && !sessionStorage.getItem("referralCode")) {
      sessionStorage.setItem("referralCode", refCode);
    }

    setReferralCode(sessionStorage.getItem("referralCode") || "");

    console.log(
      "Referral Code in Component:",
      sessionStorage.getItem("referralCode")
    );

    // Ensure the referral code stays in the URL even across different tabs
    if (refCode) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("ref", refCode);
      window.history.replaceState(null, "", newUrl);
    }
  }, []);

  useEffect(() => {
    const handleFetchUser = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) return;

        const res = await fetchUserData(userId);
        setUserRole(res.role);
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
        console.log("Property data: ", res);
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
  }, [id]);

  //Introducing lister for the first time, because, we are not making it possible for property owners to list properties themselves

  useEffect(() => {
    if (!agentId) return;

    const fetchAgentData = async () => {
      try {
        const [agentRes, ratingRes] = await Promise.all([
          fetchUserData(agentId),
          fetchUserRatingAndReviews(agentId),
        ]);
        setAgentData(agentRes);
        setListerRole(agentRes.role);
        setAgentRating(ratingRes.averageRating || 0);
      } catch (error) {
        console.error("Failed to fetch agent data or rating:", error);
      }
    };

    fetchAgentData();
  }, [agentId]);

  //fetch user bookings to check if the user has booked inspection in the past for this property
  useEffect(() => {
    const handleFetchUserBookings = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) return;
      try {
        const res = await fetchUserBookings(userId);
        setUserBookings(res);
      } catch (error) {
        console.log("Failed to fetch user bookings");
      }
    };

    handleFetchUserBookings();
  }, []);

  const hasBookedInspection = userBookings.some(
    (booking) => booking.booking.propertyID === id
  );

  const handleInspectAgain = () => {
    setShowScheduleForm(true);
  };

  const handleProceedToRent = async () => {
    try {
      const res = await createContract(
        id,
        property.data.title,
        agentId,
        agentData.name,
        agentData.email,
        Number(property.data.price.replace(/[₦,]/g, "")),
        `${property.data.houseNoStreet}, ${property.data.lga}, ${property.data.state}`
      );
      router.push(`/contract-dashboard/${res.data._id}`);
    } catch (error) {
      console.log("Failed to create contract");
    }
  };

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
          <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
              {/* Scrollable Property details */}
              <div className="flex-1 bg-white shadow-lg rounded-xl p-0 md:p-6 lg:p-8 min-h-screen overflow-y-auto">
                <PropertyDetails
                  property={property.data}
                  agentId={property.data.userID}
                />
              </div>

              {/* Sticky Sidebar */}
              <aside className="w-full lg:w-1/3 lg:sticky lg:top-8 h-fit space-y-6">
                {/* Agent Profile Card */}
                <Link href={`/agent-profile/${agentId}`}>
                  <AgentProfileCard
                    agentData={agentData}
                    agentRating={agentRating}
                  />
                </Link>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <FavoriteButton property={property} />

                  {userRole === "agent" && listerRole === "owner" && (
                    <AgencyRequestButton
                      propertyId={id}
                      ownerId={property.data.userID}
                    />
                  )}
                </div>

                {/* Share Buttons */}
                <ShareButtons property={property} />

                {/* Inspection Form or Proceed to Rent */}
                {agentId && (
                  <div className="mt-6">
                    {hasBookedInspection ? (
                      showScheduleForm ? (
                        <ScheduleInspectionForm
                          propertyId={id}
                          agentId={agentId}
                          referralCode={referralCode}
                        />
                      ) : (
                        (userRole === "buyer" || userRole === "renter") && (
                          <ProceedToRent
                            onProceed={handleProceedToRent}
                            onBookInspection={handleInspectAgain}
                          />
                        )
                      )
                    ) : (
                      <ScheduleInspectionForm
                        propertyId={id}
                        agentId={agentId}
                        referralCode={referralCode}
                      />
                    )}
                  </div>
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
