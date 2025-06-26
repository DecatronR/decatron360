import React from "react";
import PropertyRequestForm from "components/PropertyRequest/PropertyRequestForm";

const CreatePropertyRequestPage = () => {
  return (
    <section className="bg-blue-50">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h2 className="text-3xl text-center font-semibold mb-6">
            Request a Property
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Tell us what you're looking for, and we'll help you find it.
          </p>
          <PropertyRequestForm />
        </div>
      </div>
    </section>
  );
};

export default CreatePropertyRequestPage;
