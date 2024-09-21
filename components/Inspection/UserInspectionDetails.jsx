"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const UserInspectionDetails = () => {
  const router = useRouter();
  const { query } = router;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    date: null,
    time: "",
    termsAccepted: false,
    detailsConfirmed: false,
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      name: query?.name || "",
      email: query?.email || "",
      phone: query?.phone || "",
      message: query?.message || "",
      date: query?.date ? new Date(query.date) : null,
      time: query?.time || "",
    }));
  }, [query]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({ ...prevData, date }));
  };

  const handleTermsChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      termsAccepted: e.target.checked,
    }));
  };

  const handleDetailsConfirmationChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      detailsConfirmed: e.target.checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      alert("Please accept the terms and conditions.");
      return;
    }
    if (!formData.detailsConfirmed) {
      alert("Please confirm that the details are correct.");
      return;
    }
    // Perform submit logic
    console.log(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-10 max-w-2xl mx-auto">
      <h4 className="text-xl font-bold text-gray-900 mb-4">
        Inspection Details
      </h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <label className="block">
          <span className="text-gray-700">Your Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-700 shadow-sm px-4 py-2"
          />
        </label>

        {/* Email */}
        <label className="block">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-700 shadow-sm px-4 py-2"
          />
        </label>

        {/* Phone */}
        <label className="block">
          <span className="text-gray-700">Phone No</span>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-700 shadow-sm px-4 py-2"
          />
        </label>

        {/* Preferred Date & Time */}
        <label className="block">
          <span className="text-gray-700">Preferred Date & Time</span>
          <DatePicker
            selected={formData.date}
            onChange={handleDateChange}
            showTimeSelect
            timeIntervals={30}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="mt-1 block w-full rounded-md border-gray-700 shadow-sm px-4 py-2"
          />
        </label>

        {/* Message */}
        <label className="block">
          <span className="text-gray-700">Message</span>
          <textarea
            name="message"
            value={formData.message}
            readOnly
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-700 shadow-sm px-4 py-2"
          />
        </label>

        {/* Confirmation of Correct Details */}
        <label className="block">
          <input
            type="checkbox"
            checked={formData.detailsConfirmed}
            onChange={handleDetailsConfirmationChange}
            className="mr-2"
          />
          <span className="text-gray-700">
            I confirm that the details provided are correct.
          </span>
        </label>

        {/* Terms & Conditions */}
        <label className="block">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={handleTermsChange}
            className="mr-2"
          />
          <span className="text-gray-700">
            I accept the terms and conditions.
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none"
        >
          Submit Inspection Details
        </button>
      </form>
    </div>
  );
};

export default UserInspectionDetails;
