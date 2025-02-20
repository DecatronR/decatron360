"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import ButtonSpinner from "../ButtonSpinner";
import { fetchAgentSchedule } from "utils/api/scheduler/fetchAgentSchedule";
import { fetchPropertyData } from "utils/api/properties/fetchPropertyData";
import { fetchRefreeSchedule } from "utils/api/relationship/fetchRefreeSchedule";
import { useSnackbar } from "notistack";

const ScheduleInspectionForm = ({ propertyId, agentId, referralCode }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    date: null,
  });
  const [userData, setUserData] = useState({});
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState({});
  const [slotIds, setSlotIds] = useState({});
  const [displayInspectionFee, setDisplayInspectionFee] = useState();
  const [inspectionFee, setInspectionFee] = useState();

  useEffect(() => {
    if (!user) return;
    const userId = sessionStorage.getItem("userId");
    const handleFetchUser = async () => {
      const res = await fetchUserData(userId);
      setUserData(res);
    };
    handleFetchUser();
  }, []);

  useEffect(() => {
    const handleFetchPropertyData = async () => {
      const propertyDetails = await fetchPropertyData(propertyId);

      const sanitizedInspectionFee = parseFloat(
        propertyDetails.data?.inspectionFee?.replace(/[^0-9.]/g, "")
      );
      setDisplayInspectionFee(propertyDetails.data?.inspectionFee); //for display purpose
      setInspectionFee(sanitizedInspectionFee); // for computation purpose
    };

    handleFetchPropertyData();
  }, [propertyId]);

  useEffect(() => {
    const handleFetchAgentSchedule = async () => {
      console.log("Referall code ....: ", referralCode);
      try {
        if (referralCode === undefined) return; // Ensure referralCode is checked first
        //when I am sure the referral code returns the required dat, uncommend the conditional statement
        //////////////////////
        let rawAvailability;
        // if (referralCode) {
        rawAvailability = await fetchRefreeSchedule(referralCode);
        console.log("availability from refree: ", rawAvailability);
        // } else if (agentId) {
        //   rawAvailability = await fetchAgentSchedule(agentId);
        // } else {
        //   return;
        // }
        //////////////////////////

        if (!rawAvailability || rawAvailability.length === 0) {
          enqueueSnackbar("No available inspection slots found.", {
            variant: "warning",
          });
          return;
        }

        // Create new objects for state updates
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

        // Batch state updates together
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

    // Look up the slotId for the selected date and time
    const selectedSlotId = slotIds[selectedDate]?.[selectedTime];

    // Check if a valid slotId is found
    if (selectedSlotId) {
      // Store the slotId, inspection date, and time in sessionStorage
      sessionStorage.setItem("bookedSlotId", selectedSlotId);
      sessionStorage.setItem("inspectionDate", selectedDate);
      sessionStorage.setItem("inspectionTime", selectedTime);
      sessionStorage.setItem("agentId", agentId);
    } else {
      console.error("Selected slot is unavailable or not found.");
      setIsButtonLoading(false);
      return;
    }

    // Check if the user is logged in
    if (!user) {
      // Redirect to login page, with the appropriate redirect based on the inspection fee
      const redirectPage =
        inspectionFee && !isNaN(inspectionFee) && inspectionFee > 0
          ? `/inspection/payment-booking/${propertyId}`
          : `/inspection/non-payment-booking/${propertyId}`;
      router.push(`/auth/login?redirect=${encodeURIComponent(redirectPage)}`);
      setIsButtonLoading(false);
      return;
    }

    // Determine the route based on inspection fee
    if (inspectionFee && !isNaN(inspectionFee) && inspectionFee > 0) {
      // Redirect to the payment booking page
      router.push(`/inspection/payment-booking/${propertyId}`);
    } else {
      // Redirect to the non-payment page
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

    // Convert `time` to "HH:mm" format
    const formattedTime = format(time, "HH:mm");

    return availableDates[selectedDate].some(
      (slot) => slot === formattedTime // Compare formatted time directly with available time slot
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-xl font-bold text-gray-900 mb-4">
        Schedule an Inspection
      </h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Your Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-500 sm:text-sm px-4 py-2"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-500 sm:text-sm px-4 py-2"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Phone No</span>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="08020000000"
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-500 sm:text-sm px-4 py-2"
          />
        </label>
        {inspectionFee > 0 && (
          <label className="block">
            <span className="text-gray-700">Inspection Fee</span>
            <input
              type="text"
              name="inspectionFee"
              value={displayInspectionFee}
              disabled
              className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:outline-none bg-gray-100 text-gray-500 sm:text-sm px-4 py-2 cursor-not-allowed opacity-70"
            />
          </label>
        )}

        <label className="block">
          <span className="text-gray-700">Preferred Date & Time</span>
          <DatePicker
            selected={formData.date}
            onChange={handleDateChange}
            showTimeSelect
            timeIntervals={60}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-500 sm:text-sm px-4 py-2"
            required
            filterDate={(date) => isDateAvailable(date)} // Disable unavailable dates
            filterTime={(time) => isTimeAvailable(time)} // Disable times not available
          />
        </label>
        <button
          type="submit"
          disabled={isButtonLoading}
          className={`w-full py-2 px-4 rounded-md shadow-md ${
            isButtonLoading
              ? "bg-gray-400"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          {isButtonLoading ? <ButtonSpinner /> : "Schedule Inspection"}
        </button>
      </form>
    </div>
  );
};

export default ScheduleInspectionForm;
