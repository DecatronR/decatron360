import { SlidersHorizontal } from "lucide-react"; // Importing filter icon
import PropertySearchForm from "./Properties/PropertySearchForm";

const Hero = () => {
  return (
    <section className="relative bg-primary-500 py-24 lg:py-24 text-white z-0">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
        <div className="text-center mb-10">
          {/* Hook statement */}
          <h1
            className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight"
            style={{ fontFamily: "Nasaliation, sans-serif" }}
          >
            Real estate transactions like shopping online
          </h1>
        </div>

        {/* PropertySearchForm with Filter Button */}
        <div className="relative z-10 w-full max-w-3xl flex items-center gap-3 bg-white shadow-lg rounded-full px-4 py-2 border border-gray-300">
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
            <SlidersHorizontal size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
