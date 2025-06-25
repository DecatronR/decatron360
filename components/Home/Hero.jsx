"use client";
import { SlidersHorizontal, Play, X } from "lucide-react";
import PropertySearchForm from "../Properties/PropertySearchForm";
import { useState } from "react";
import { createPortal } from "react-dom";

const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      <section className="relative bg-primary-500 py-24 lg:py-24 text-white z-0">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
          <div className="text-center mb-10">
            {/* Hook statement with improved readability */}
            <h1 className="font-raleway text-2xl sm:text-2xl lg:text-3xl font-extrabold tracking-wide">
              Real estate transactions like online shopping
            </h1>
          </div>

          {/* PropertySearchForm with Filter Button */}
          <div className="relative z-10 w-full max-w-3xl sm:max-w-xl  md:max-w-2xl lg:max-w-3xl flex items-center gap-3 bg-white/90 shadow-lg rounded-full px-3 py-2  border border-gray-300 focus-within:ring-2 ring-primary-500 transition-all">
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

          {/* Watch How It Works Button */}
          <button
            className="mt-6 flex items-center gap-3 text-white hover:text-gray-200 transition-all duration-300 group relative"
            onClick={() => setShowVideo(true)}
          >
            <div className="relative">
              {/* Pulsing background effect */}
              <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
              {/* Main button */}
              <div className="relative w-14 h-14 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/40 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl border border-white/20">
                <Play className="w-7 h-7 ml-1 text-white drop-shadow-sm" />
              </div>
            </div>
            <span className="text-xl font-semibold group-hover:scale-105 transition-transform duration-300">
              Watch how it works
            </span>
          </button>
        </div>
      </section>

      {/* Video Modal - Rendered outside Hero component */}
      {showVideo &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden">
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/cJJYhN-JSWc?autoplay=1"
                  title="How it works"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Hero;
