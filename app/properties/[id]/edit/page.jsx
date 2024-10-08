"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import PropertyEditForm from "@/components/PropertyEditForm";

const PropertyEditPage = () => {
  const { id } = useParams();

  useEffect(() => {
    console.log("property id in edit PAGE: ", id);
  }, []);
  return (
    <section className="bg-blue-50 min-h-screen flex items-center">
      <div className="container mx-auto max-w-3xl p-6">
        <PropertyEditForm propertyId={id} />
      </div>
    </section>
  );
};

export default PropertyEditPage;
