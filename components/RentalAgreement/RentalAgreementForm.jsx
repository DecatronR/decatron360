"use client";
import React, { useState } from "react";

const RentalAgreementForm = () => {
  const [fields, setFields] = useState({
    witnessName: "",
    witnessEmail: "",
    witnessPhone: "",
    renewalOption: "",
    renewalNoticePeriod: "",
  });

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Rental Agreement Submitted:", fields);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        Witness & Renewal Information
      </h2>

      {/* Witness Full Name */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <label className="block text-gray-800 font-medium mb-3">
          Witness Full Name
        </label>
        <input
          type="text"
          name="witnessName"
          className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
          value={fields.witnessName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Witness Contact Details */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <label className="block text-gray-800 font-medium mb-3">
          Witness Contact Details
        </label>
        <div className="flex space-x-4">
          <input
            type="email"
            name="witnessEmail"
            className="border rounded-lg w-1/2 py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Email"
            value={fields.witnessEmail}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="witnessPhone"
            className="border rounded-lg w-1/2 py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Phone Number"
            value={fields.witnessPhone}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Renewal Option */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <label className="block text-gray-800 font-medium mb-3">
          Would the tenant like to renew the lease when it expires?
        </label>
        <div className="flex gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="renewalOption"
              value="yes"
              className="w-5 h-5"
              checked={fields.renewalOption === "yes"}
              onChange={handleChange}
            />
            <span className="text-gray-700">Yes</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="renewalOption"
              value="no"
              className="w-5 h-5"
              checked={fields.renewalOption === "no"}
              onChange={handleChange}
            />
            <span className="text-gray-700">No</span>
          </label>
        </div>
      </div>

      {/* Renewal Notice Period */}
      {fields.renewalOption === "yes" && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
          <label className="block text-gray-800 font-medium mb-3">
            Renewal Notice Period (in months)
          </label>
          <input
            type="number"
            name="renewalNoticePeriod"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter number of months"
            value={fields.renewalNoticePeriod}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-primary-500 text-white px-6 py-3 rounded-full transition hover:bg-primary-600"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default RentalAgreementForm;
