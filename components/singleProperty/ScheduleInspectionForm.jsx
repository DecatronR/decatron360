"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useAuth } from "@/context/AuthContext";
import { bookInspection } from "@/utils/api/inspection/bookInspection";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import ButtonSpinner from "../ButtonSpinner";

const ScheduleInspectionForm = ({ propertyId, agentId }) => {
  const { enqueueSnackbar } = useSnackbar();
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const userId = sessionStorage.getItem("userId");
    const handleFetchUser = async () => {
      const res = await fetchUserData(userId);
      setUserData(res);
    };
    handleFetchUser();
  }, []);

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
    setIsLoading(true);
    const formattedDate = formData.date
      ? format(formData.date, "yyyy-MM-dd")
      : "";
    const formattedTime = formData.date ? format(formData.date, "HH:mm") : "";

    const userId = sessionStorage.getItem("userId");
    sessionStorage.setItem("inspectionDate", formattedDate);
    sessionStorage.setItem("inspectionTime", formattedTime);
    sessionStorage.setItem("agentId", agentId);
    if (!userId) {
      // Redirect to login if not logged in
      router.push(
        `/auth/login?redirect=${encodeURIComponent(
          `/inspection/booking/${propertyId}`
        )}`
      );
    } else {
      router.push(`/inspection/booking/${propertyId}`);
      // try {
      //   const bookingId = await handleBookInspection(userId);
      //   console.log("Booking id: ", bookingId);
      //   enqueueSnackbar("Successfully booked inspection", {
      //     variant: "success",
      //   });
      //   // Redirect to the inspection details page with the booking ID
      //   router.push(`/inspection/details?bookingId=${bookingId}`);
      // } catch (error) {
      //   enqueueSnackbar("Failed to book inspection", { variant: "error" });
      // }
    }
    setIsLoading(false);
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
            timeIntervals={30}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-500 sm:text-sm px-4 py-2"
            required
          />
        </label>
        {/* <label className="block">
          <span className="text-gray-700">Message</span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Additional details or requests"
            rows="4"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-500 sm:text-sm px-4 py-2"
          />
        </label> */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md shadow-md ${
            isLoading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          {isLoading ? "Submitting...." : "Schedule Inspection"}
        </button>
      </form>
    </div>
  );
};

export default ScheduleInspectionForm;
