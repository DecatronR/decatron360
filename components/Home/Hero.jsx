import { SlidersHorizontal } from "lucide-react";
import PropertySearchForm from "../Properties/PropertySearchForm";

const Hero = () => {
  return (
    <section className="relative bg-primary-500 py-24 lg:py-24 text-white z-0">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-30 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
        <div className="text-center mb-10">
          {/* Hook statement with improved readability */}
          <h1 className="font-raleway text-2xl sm:text-2xl lg:text-4xl font-extrabold tracking-wide">
            Real estate transactions like online shopping
          </h1>
        </div>

        {/* PropertySearchForm with Filter Button */}
        <div className="relative z-10 w-full max-w-3xl sm:max-w-xl  md:max-w-2xl lg:max-w-3xl flex items-center gap-3 bg-white/90 shadow-lg rounded-full px-4 py-3  border border-gray-300 focus-within:ring-2 ring-primary-500 transition-all">
          {/* Search Form takes up most of the space */}
          <div className="flex-grow">
            <PropertySearchForm />
          </div>

          {/* Filter Button */}
          <button
            className="p-2 bg-gray-100 text-primary-500 rounded-full shadow-md hover:bg-gray-200 transition-all"
            aria-label="Filter properties"
            onClick={""}
          >
            <SlidersHorizontal size={22} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
