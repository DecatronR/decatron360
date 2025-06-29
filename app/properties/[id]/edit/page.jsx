"use client";
import { useParams } from "next/navigation";
import PropertyEditForm from "components/Properties/PropertyEditForm";

const PropertyEditPage = () => {
  const { id } = useParams();

  return (
    <section className="bg-white min-h-screen flex items-center">
      <div className="container mx-auto max-w-3xl py-6">
        <PropertyEditForm propertyId={id} />
      </div>
    </section>
  );
};

export default PropertyEditPage;
