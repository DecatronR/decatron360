"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import ButtonSpinner from "../ui/ButtonSpinner";
import { fetchAgentSchedule } from "utils/api/scheduler/fetchAgentSchedule";
import { fetchPropertyData } from "utils/api/properties/fetchPropertyData";
import { fetchReferrerSchedule } from "utils/api/scheduler/fetchReferrerSchedule";
import { useSnackbar } from "notistack";
import { Calendar, Clock, User, Mail, Phone } from "lucide-react";

const ScheduleInspectionForm = ({ propertyId, agentId, referralCode }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: null,
  });
  const [userData, setUserData] = useState({});
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState({});
  const [slotIds, setSlotIds] = useState({});
  const [displayInspectionFee, setDisplayInspectionFee] = useState();
  const [inspectionFee, setInspectionFee] = useState();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    if (!user) return;
    const userId = sessionStorage.getItem("userId");
    const handleFetchUser = async () => {
      try {
        const res = await fetchUserData(userId);
        setUserData(res);
        setIsUserLoggedIn(true);

        // Pre-populate form with user data
        setFormData((prev) => ({
          ...prev,
          name: res.name || "",
          email: res.email || "",
          phone: res.phone || "",
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    handleFetchUser();
  }, [user]);

  useEffect(() => {
    const handleFetchPropertyData = async () => {
      try {
        const propertyDetails = await fetchPropertyData(propertyId);
        const sanitizedInspectionFee = parseFloat(
          propertyDetails.data?.inspectionFee?.replace(/[^0-9.]/g, "")
        );
        setDisplayInspectionFee(propertyDetails.data?.inspectionFee);
        setInspectionFee(sanitizedInspectionFee);
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    };

    handleFetchPropertyData();
  }, [propertyId]);

  useEffect(() => {
    const handleFetchAgentSchedule = async () => {
      try {
        if (referralCode === undefined) return;

        let rawAvailability;
        if (referralCode) {
          rawAvailability = await fetchReferrerSchedule(referralCode);
          console.log("availability from refree: ", rawAvailability);
        } else if (agentId) {
          rawAvailability = await fetchAgentSchedule(agentId);
        } else {
          return;
        }

        if (!rawAvailability || rawAvailability.length === 0) {
          enqueueSnackbar("No available inspection slots found.", {
            variant: "warning",
          });
          return;
        }

        const newSlotIds = {};
        const formattedAvailability = rawAvailability.reduce((acc, slot) => {
          if (slot.isAvailable === "0") {
            const formattedDate = format(new Date(slot.date), "yyyy-MM-dd");
            const formattedTime = `${slot.time.padStart(2, "0")}:00`;

            acc[formattedDate] = acc[formattedDate] || [];
            acc[formattedDate].push(formattedTime);

            newSlotIds[formattedDate] = newSlotIds[formattedDate] || {};
            newSlotIds[formattedDate][formattedTime] = slot._id;
          }
          return acc;
        }, {});

        setAvailableDates(formattedAvailability);
        setSlotIds(newSlotIds);
      } catch (error) {
        enqueueSnackbar("Error fetching schedule", { variant: "error" });
      }
    };

    handleFetchAgentSchedule();
  }, [agentId, referralCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsButtonLoading(true);

    const selectedDate = formData.date
      ? format(formData.date, "yyyy-MM-dd")
      : "";
    const selectedTime = formData.date ? format(formData.date, "HH:mm") : "";

    const selectedSlotId = slotIds[selectedDate]?.[selectedTime];

    if (selectedSlotId) {
      sessionStorage.setItem("bookedSlotId", selectedSlotId);
      sessionStorage.setItem("inspectionDate", selectedDate);
      sessionStorage.setItem("inspectionTime", selectedTime);
      sessionStorage.setItem("agentId", agentId);
    } else {
      console.error("Selected slot is unavailable or not found.");
      setIsButtonLoading(false);
      return;
    }

    // If user is not logged in, store form data and redirect to login
    if (!user) {
      // Store form data in sessionStorage for login/signup flow
      sessionStorage.setItem(
        "inspectionFormData",
        JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          propertyId,
          agentId,
          referralCode,
          inspectionFee,
          displayInspectionFee,
        })
      );

      const redirectPage =
        inspectionFee && !isNaN(inspectionFee) && inspectionFee > 0
          ? `/inspection/payment-booking/${propertyId}`
          : `/inspection/non-payment-booking/${propertyId}`;

      router.push(`/auth/login?redirect=${encodeURIComponent(redirectPage)}`);
      setIsButtonLoading(false);
      return;
    }

    // User is logged in, proceed to booking
    if (inspectionFee && !isNaN(inspectionFee) && inspectionFee > 0) {
      router.push(`/inspection/payment-booking/${propertyId}`);
    } else {
      router.push(`/inspection/non-payment-booking/${propertyId}`);
    }

    setIsButtonLoading(false);
  };

  const isDateAvailable = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return !!availableDates[formattedDate];
  };

  const isTimeAvailable = (time) => {
    const selectedDate = formData.date
      ? format(formData.date, "yyyy-MM-dd")
      : null;

    if (!selectedDate || !availableDates[selectedDate]) return false;

    const formattedTime = format(time, "HH:mm");
    return availableDates[selectedDate].some((slot) => slot === formattedTime);
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-center mb-6">
        <Calendar className="w-6 h-6 text-gray-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-800">
          Schedule Inspection
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <User className="w-4 h-4 mr-2" />
            Your Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            disabled={isUserLoggedIn}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
              isUserLoggedIn
                ? "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                : "border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            }`}
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Mail className="w-4 h-4 mr-2" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            required
            disabled={isUserLoggedIn}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
              isUserLoggedIn
                ? "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                : "border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            }`}
          />
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Phone className="w-4 h-4 mr-2" />
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="08020000000"
            required
            disabled={isUserLoggedIn}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
              isUserLoggedIn
                ? "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                : "border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            }`}
          />
        </div>

        {/* Inspection Fee Display */}
        {inspectionFee > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Inspection Fee:
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {displayInspectionFee}
              </span>
            </div>
          </div>
        )}

        {/* Date & Time Picker */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Clock className="w-4 h-4 mr-2" />
            Preferred Date & Time
          </label>
          <div className="relative">
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              showTimeSelect
              timeIntervals={60}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
              required
              filterDate={(date) => isDateAvailable(date)}
              filterTime={(time) => isTimeAvailable(time)}
              placeholderText="Select a date and time"
              wrapperClassName="w-full"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isButtonLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
            isButtonLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md"
          }`}
        >
          {isButtonLoading ? (
            <ButtonSpinner />
          ) : (
            <>
              <Calendar className="w-5 h-5 mr-2" />
              {isUserLoggedIn ? "Schedule Inspection" : "Continue to Schedule"}
            </>
          )}
        </button>

        {/* Info for guest users */}
        {!isUserLoggedIn && (
          <p className="text-xs text-gray-500 text-center">
            You'll be prompted to sign in or create an account to complete your
            booking
          </p>
        )}
      </form>
    </div>
  );
};

export default ScheduleInspectionForm;
