import React from "react";
import PropertyRequestForm from "components/PropertyRequest/PropertyRequestForm";

const CreatePropertyRequestPage = () => {
  return (
    <section className="bg-blue-50">
      <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
        <PropertyRequestForm />
      </div>
    </section>
  );
};

export default CreatePropertyRequestPage;
