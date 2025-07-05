import React from "react";
import PropertyRequestForm from "components/PropertyRequest/PropertyRequestForm";

const CreatePropertyRequestPage = () => {
  return (
    <section className="bg-white min-h-screen flex items-center">
      <div className="container mx-auto max-w-3xl py-6">
        <PropertyRequestForm />
      </div>
    </section>
  );
};

export default CreatePropertyRequestPage;
