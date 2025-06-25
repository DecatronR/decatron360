"use client";
import React, { useState, useEffect } from "react";
import StarRatings from "react-star-ratings";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import {
  Star,
  CheckCircle,
  XCircle,
  MessageSquare,
  Send,
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Loader2,
} from "lucide-react";
import { rateAndReviewUser } from "@/utils/api/user/rateAndReviewUser";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import { fetchPropertyData } from "@/utils/api/properties/fetchPropertyData";

const useAgentData = (agentId) => {
  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agentId) return;

    const fetchAgent = async () => {
      try {
        const data = await fetchUserData(agentId);
        setAgentData(data);
      } catch (error) {
        console.error("Failed to fetch agent data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [agentId]);

  return { agentData, loading };
};

const usePropertyData = (propertyId) => {
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) return;

    const fetchProperty = async () => {
      try {
        const data = await fetchPropertyData(propertyId);
        setPropertyData(data.data);
      } catch (error) {
        console.error("Failed to fetch property data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  return { propertyData, loading };
};

const InspectionFeedbackForm = ({ inspectionData }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [inspectionResult, setInspectionResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const agentId = inspectionData.agentID;

  const { agentData, loading: agentLoading } = useAgentData(agentId);
  const { propertyData, loading: propertyLoading } = usePropertyData(
    inspectionData.propertyID
  );

  const changeRating = (newRating) => {
    setRating(newRating);
  };

  console.log("inspectionData", inspectionData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inspectionResult) {
      enqueueSnackbar("Please select an inspection result", {
        variant: "error",
      });
      return;
    }

    if (rating === 0) {
      enqueueSnackbar("Please provide a rating", { variant: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewerId = sessionStorage.getItem("userId");
      await rateAndReviewUser(agentId, rating, reviewerId, review);
      enqueueSnackbar("Feedback submitted successfully!", {
        variant: "success",
      });
      router.push("/");
    } catch (error) {
      console.log("Failed to submit feedback: ", error);
      enqueueSnackbar("Failed to submit feedback. Please try again.", {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Inspection Feedback
                </h1>
                <p className="text-sm text-gray-600">Share your experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Inspection Result Section */}
                <div>
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Inspection Result
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <label className="relative">
                      <input
                        type="radio"
                        name="inspectionResult"
                        value="Successful"
                        checked={inspectionResult === "Successful"}
                        onChange={(e) => setInspectionResult(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          inspectionResult === "Successful"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${
                              inspectionResult === "Successful"
                                ? "border-green-500 bg-green-500"
                                : "border-gray-300"
                            }`}
                          >
                            {inspectionResult === "Successful" && (
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">
                              Successful
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              Inspection completed successfully
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="relative">
                      <input
                        type="radio"
                        name="inspectionResult"
                        value="Not Successful"
                        checked={inspectionResult === "Not Successful"}
                        onChange={(e) => setInspectionResult(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          inspectionResult === "Not Successful"
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${
                              inspectionResult === "Not Successful"
                                ? "border-red-500 bg-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            {inspectionResult === "Not Successful" && (
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">
                              Not Successful
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              Inspection was not completed
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Rating Section */}
                <div>
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Rate the Agent
                    </h2>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                    <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                      <StarRatings
                        rating={rating}
                        starRatedColor="#fbbf24"
                        starHoverColor="#f59e0b"
                        changeRating={changeRating}
                        numberOfStars={5}
                        name="rating"
                        starDimension="32px"
                        starSpacing="6px"
                        className="sm:starDimension-40px sm:starSpacing-8px"
                      />
                      <p className="text-sm text-gray-600 text-center">
                        {rating === 0 && "Select a rating"}
                        {rating === 1 && "Poor"}
                        {rating === 2 && "Fair"}
                        {rating === 3 && "Good"}
                        {rating === 4 && "Very Good"}
                        {rating === 5 && "Excellent"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Review Section */}
                <div>
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Write a Review
                    </h2>
                  </div>

                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none"
                    rows="4"
                    placeholder="Share your experience with this agent. What went well? What could be improved?"
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    Your review helps other users make informed decisions
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar - Mobile: Show after form, Desktop: Show on right */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
            {/* Inspection Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
                Inspection Summary
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Agent</p>
                    {agentLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 animate-spin" />
                        <span className="text-xs sm:text-sm text-gray-500">
                          Loading...
                        </span>
                      </div>
                    ) : (
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        {agentData?.name ||
                          agentData?.firstName ||
                          "Agent Name"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {inspectionData?.bookingDateTime
                        ? new Date(
                            inspectionData.bookingDateTime
                          ).toLocaleDateString()
                        : "Not available"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Property</p>
                    {propertyLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 animate-spin" />
                        <span className="text-xs sm:text-sm text-gray-500">
                          Loading...
                        </span>
                      </div>
                    ) : (
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        {propertyData
                          ? `${propertyData.neighbourhood}, ${propertyData.lga}, ${propertyData.state}`
                          : "Property Address"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6">
              <h3 className="font-semibold text-blue-900 mb-2 sm:mb-3 text-sm sm:text-base">
                Tips for Great Feedback
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-blue-800">
                <li className="flex items-start space-x-2">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <span>Be specific about what went well</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <span>Mention any areas for improvement</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <span>Share your overall experience</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionFeedbackForm;
