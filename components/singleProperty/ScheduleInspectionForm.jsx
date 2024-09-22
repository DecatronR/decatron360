import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import getCoordinates from "@/utils/getCoordinates";

const ScheduleInspectionForm = ({ propertyId, propertyData }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    date: null,
    time: "",
  });
  const propertyLocation = `${propertyData.neighbourhood} ${propertyData.lga} ${propertyData.state}`;
  const [propertyCoordinates, setPropertyCoordinates] = useState("");

  useEffect(() => {
    const fetchPropertyCoordinates = async () => {
      if (propertyLocation) {
        const coordinates = await getCoordinates(propertyLocation);
        setPropertyCoordinates(coordinates);
      }
    };
    fetchPropertyCoordinates();
  }, []);

  console.log("property data: ", propertyData);

  // Generate time options from 9am to 5pm in 30-minute increments
  const times = [];
  for (let hour = 9; hour < 17; hour++) {
    times.push(`${hour}:00`, `${hour}:30`);
  }

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
      date: date,
    }));
  };

  const handleBookInspection = () => {
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
      latitude: propertyCoordinates.latitude,
      longitude: propertyCoordinates.longitude,
    };

    sessionStorage.setItem("inspectionData", JSON.stringify(data));
    // sessionStorage.setItem("redirectPath", "/inspection/details");
    const queryParams = `id=${encodeURIComponent(propertyId)}`;

    console.log("query property id: ", queryParams);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    handleBookInspection();
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Schedule Inspection
        </button>
      </form>
    </div>
  );
};

export default ScheduleInspectionForm;
