import React from "react";
import PropertyRequestForm from "components/PropertyRequest/PropertyRequestForm";

const CreatePropertyRequestPage = () => {
  return (
    <section className="bg-grey-50">
      <div className="bg-white mb-4 rounded-md border m-4 md:m-0">
        <PropertyRequestForm />
      </div>
    </section>
  );
};

export default CreatePropertyRequestPage;
