import PropertySearchForm from "./PropertySearchForm";

const Hero = () => {
  return (
    <section className="relative bg-primary-500 py-20 mb-4 z-0">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-10 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl transition-transform transform hover:scale-105">
            Find The Perfect Property
          </h1>
          <p className="my-4 text-xl text-white">
            Discover the perfect property that suits your needs.
          </p>
        </div>

        {/* PropertySearchForm should be here and should be interactable */}
        <div className="relative z-10">
          {" "}
          {/* Adding relative z-index for debugging */}
          <PropertySearchForm />
        </div>
      </div>
    </section>
  );
};

export default Hero;
