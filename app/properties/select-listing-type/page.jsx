import SelectListingType from "@/components/SelectListingType";

const SelectListingTypePage = () => {
  return (
    <section className="bg-blue-50 min-h-screen">
      <div className="container m-auto max-w-5xl py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800">
            Select Your Listing Type
          </h1>
          <p className="text-lg text-gray-600">
            Choose from the options below to get started.
          </p>
        </div>
        <SelectListingType />
      </div>
    </section>
  );
};

export default SelectListingTypePage;
