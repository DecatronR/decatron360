import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

const ScheduleInspectionForm = ({ propertyId }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    date: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleBookInspection = async () => {
    const formattedDate = formData.date
      ? format(formData.date, "yyyy-MM-dd")
      : "";
    const formattedTime = formData.date ? format(formData.date, "HH:mm") : "";

    const data = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: "buyer",
      message: formData.message,
      date: formattedDate,
      time: formattedTime,
    };

    sessionStorage.setItem("inspectionData", JSON.stringify(data));
    const queryParams = `id=${encodeURIComponent(propertyId)}`;

    if (!user) {
      router.push(
        `/auth/login?redirect=${encodeURIComponent(
          `/inspection/details?${queryParams}`
        )}`
      );
    } else {
      router.push(`/inspection/details?${queryParams}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await handleBookInspection();
    } catch (error) {
      setErrorMessage("Error scheduling inspection. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-xl font-bold text-gray-900 mb-4">
        Schedule an Inspection
      </h4>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
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
        <label className="block">
          <span className="text-gray-700">Message</span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Additional details or requests"
            rows="4"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-500 sm:text-sm px-4 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md shadow-md ${
            isSubmitting ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          {isSubmitting ? "Scheduling..." : "Schedule Inspection"}
        </button>
      </form>
    </div>
  );
};

export default ScheduleInspectionForm;
