"use client";
import { SlidersHorizontal, Play, X } from "lucide-react";
import PropertySearchForm from "../Properties/PropertySearchForm";
import { useState } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section
      className="relative py-28 lg:py-32 z-0 overflow-hidden"
      style={{ background: "#ffffff" }}
    >
      {/* Animated blurred gradient blob background */}
      <motion.div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full z-0"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #5a47fb 0%, #eae6fc 80%)",
          filter: "blur(120px)",
          opacity: 0.45,
        }}
        animate={{ scale: [1, 1.08, 1], x: [0, 20, 0], y: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Subtle secondary blob */}
      <motion.div
        className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full z-0"
        style={{
          background:
            "radial-gradient(circle at 70% 60%, #eae6fc 0%, #5a47fb 60%)",
          filter: "blur(100px)",
          opacity: 0.25,
        }}
        animate={{ scale: [1, 1.1, 1], x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Abstract floating particles */}
      <motion.div
        className="absolute top-24 left-1/4 w-16 h-16 rounded-full bg-primary-500/20 z-10"
        animate={{ y: [0, -18, 0], x: [0, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 right-1/3 w-10 h-10 rounded-full bg-primary-500/15 z-10"
        animate={{ y: [0, 12, 0], x: [0, -8, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 right-24 w-8 h-8 rounded-full bg-primary-500/10 z-10"
        animate={{ y: [0, -10, 0], x: [0, 6, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-20">
        {/* Left: Text + Search */}
        <motion.div
          className="lg:w-1/2 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-12">
            <motion.h1
              className="font-raleway text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-tight"
              style={{ color: "#08253f" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Real estate transactions like online{" "}
              <span className="font-nasalization" style={{ color: "#5a47fb" }}>
                shopping
              </span>
            </motion.h1>
            <p
              className="font-raleway text-lg sm:text-xl opacity-80 max-w-xl mx-auto lg:mx-0"
              style={{ color: "#08253f" }}
            >
              Discover, request, and secure your next property with the ease of
              online shopping. Experience a seamless, modern real estate
              journey.
            </p>
          </div>
          {/* Glassmorphism card for search form */}
          <motion.div
            className="relative z-10 w-full max-w-3xl sm:max-w-xl md:max-w-2xl lg:max-w-none flex items-center gap-3 bg-white/60 shadow-xl rounded-2xl px-4 py-3 border border-gray-200 backdrop-blur-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            style={{ boxShadow: "0 8px 32px 0 rgba(90,71,251,0.08)" }}
          >
            <div className="flex-grow">
              <PropertySearchForm />
            </div>
            <button
              className="p-2 bg-primary-50 text-primary-500 rounded-full shadow-md hover:bg-primary-100 transition-all"
              aria-label="Filter properties"
              onClick={""}
            >
              <SlidersHorizontal size={22} />
            </button>
          </motion.div>
        </motion.div>
        {/* Right: Video */}
        <motion.div
          className="lg:w-1/2 w-full max-w-lg mx-auto lg:mx-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl bg-black/80 border border-primary-100"
            style={{ boxShadow: "0 8px 32px 0 rgba(90,71,251,0.12)" }}
          >
            {/* Video logic unchanged */}
            {!showVideo ? (
              <>
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <img
                    src={`https://img.youtube.com/vi/cJJYhN-JSWc/maxresdefault.jpg`}
                    alt="How it works video thumbnail"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                  <motion.button
                    onClick={() => setShowVideo(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="absolute inset-0 bg-white/30 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <div className="relative w-20 h-20 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/40 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl border border-white/20">
                        <Play className="w-10 h-10 ml-1 text-white drop-shadow-sm" />
                      </div>
                    </div>
                  </motion.button>
                </div>
                {/* <div className="p-4 bg-primary-100 backdrop-blur-sm text-center">
                  <p className="text-sm text-gray-700">
                    See how it works in a few minutes
                  </p>
                </div> */}
              </>
            ) : (
              <>
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
                  <button
                    onClick={() => setShowVideo(false)}
                    className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
      {/* Diagonal SVG divider at the bottom for seamless blend */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-30">
        <svg
          viewBox="0 0 1920 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-24"
        >
          <polygon points="0,100 1920,0 1920,100" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
