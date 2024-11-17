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

const ScheduleInspectionForm = ({ propertyId, agentId }) => {
  const router = useRouter();
  const { user } = useAuth();
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
    const handleFetchAgentSchedule = async () => {
      const rawAvailability = await fetchAgentSchedule(agentId);

      // Transform the data into the required format
      const formattedAvailability = rawAvailability.reduce((acc, slot) => {
        if (slot.isAvailable === "0") {
          // Only add available slots
          const formattedDate = format(new Date(slot.date), "yyyy-MM-dd");
          const formattedTime = `${slot.time.padStart(2, "0")}:00`; // Format time as HH:mm

          // Initialize the date key if it doesn't exist
          if (!acc[formattedDate]) {
            acc[formattedDate] = [];
          }

          // Add the time to the date's array
          acc[formattedDate].push(formattedTime);

          slotIds[formattedDate] = slotIds[formattedDate] || {};
          slotIds[formattedDate][formattedTime] = slot._id;
        }
        return acc;
      }, {});

      console.log("Formatted Availability:", formattedAvailability);
      console.log("Slot IDs:", slotIds);
      setAvailableDates(formattedAvailability);
      setSlotIds(slotIds);
    };

    handleFetchAgentSchedule();
  }, [agentId]);

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
    }

    // Check if the user is logged in
    if (!user) {
      // Redirect to login page if the user is not logged in
      router.push(
        `/auth/login?redirect=${encodeURIComponent(
          `/inspection/booking/${propertyId}`
        )}`
      );
    } else {
      // Redirect to the inspection booking page if the user is logged in
      router.push(`/inspection/booking/${propertyId}`);
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
