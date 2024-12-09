import SelectListingType from "@/components/Properties/SelectListingType";

const SelectListingTypePage = () => {
  return (
    <section className="bg-blue-50 min-h-screen">
      <div className="container mx-auto max-w-4xl px-6 sm:px-8 md:px-10 py-12 sm:py-16 md:py-24">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Select Your Listing Type
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Choose from the options below to get started.
          </p>
        </div>
        <SelectListingType />
      </div>
    </section>
  );
};

export default SelectListingTypePage;
