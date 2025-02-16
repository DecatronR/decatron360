"use client";
import React, { useState } from "react";

const RentalAgreementForm = () => {
  const [fields, setFields] = useState({
    tenantName: "",
    landlordName: "",
    propertyAddress: "",
    rentAmount: "",
    depositAmount: "",
    leaseDuration: "",
    startDate: "",
    endDate: "",
    terms: "",
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
      <h2 className="text-xl font-semibold text-gray-800">Rental Agreement</h2>

      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <label className="block text-gray-800 font-medium mb-3">Name</label>
        <div className="flex space-x-4">
          <input
            type="text"
            name="firstName"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
            value={fields.firstName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="middleName"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
            value={fields.middleName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastName"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
            value={fields.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <label className="block text-gray-800 font-medium mb-3">
          Contact Details
        </label>
        <div className="flex space-x-4">
          <input
            type="text"
            name="phoneNumber"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
            value={fields.firstName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="email"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
            value={fields.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-800 font-medium mb-2">
          Landlord Name
        </label>
        <input
          type="text"
          name="landlordName"
          className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
          value={fields.landlordName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-gray-800 font-medium mb-2">
          Property Address
        </label>
        <input
          type="text"
          name="propertyAddress"
          className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
          value={fields.propertyAddress}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-gray-800 font-medium mb-2">
            Rent Amount
          </label>
          <input
            type="text"
            name="rentAmount"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="NGN 0.00"
            value={fields.rentAmount}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9.]/g, "");
              setFields({ ...fields, rentAmount: numericValue });
            }}
            required
          />
        </div>

        <div className="w-1/2">
          <label className="block text-gray-800 font-medium mb-2">
            Deposit Amount
          </label>
          <input
            type="text"
            name="depositAmount"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="NGN 0.00"
            value={fields.depositAmount}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9.]/g, "");
              setFields({ ...fields, depositAmount: numericValue });
            }}
            required
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-gray-800 font-medium mb-2">
            Lease Duration (months)
          </label>
          <input
            type="number"
            name="leaseDuration"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
            value={fields.leaseDuration}
            onChange={handleChange}
            required
          />
        </div>

        <div className="w-1/2">
          <label className="block text-gray-800 font-medium mb-2">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
            value={fields.startDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-800 font-medium mb-2">End Date</label>
        <input
          type="date"
          name="endDate"
          className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
          value={fields.endDate}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-gray-800 font-medium mb-2">
          Additional Terms
        </label>
        <textarea
          name="terms"
          className="border rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300"
          rows="4"
          placeholder="Enter any additional terms here..."
          value={fields.terms}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          className="bg-primary-500 text-white px-6 py-3 rounded-lg transition hover:bg-primary-600"
        >
          Submit Agreement
        </button>
      </div>
    </form>
  );
};

export default RentalAgreementForm;
