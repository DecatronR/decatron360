"use client";
import { useParams } from "next/navigation";
import PropertyEditForm from "components/Properties/PropertyEditForm";

const PropertyEditPage = () => {
  const { id } = useParams();

  return (
    <section className="bg-blue-50 min-h-screen flex items-center">
      <div className="container mx-auto max-w-3xl p-6">
        <PropertyEditForm propertyId={id} />
      </div>
    </section>
  );
};

export default PropertyEditPage;
