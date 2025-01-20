import PropertiesCategories from "components/Properties/PropertiesCategories";
import PropertySearchForm from "@/components/Properties/PropertySearchForm";

const PropertiesAbuja = async () => {
  return (
    <>
      <section className="bg-primary-500 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Abuja Properties
          </h1>
          <PropertySearchForm />
        </div>
      </section>
      <PropertiesCategories />
    </>
  );
};

export default PropertiesAbuja;
