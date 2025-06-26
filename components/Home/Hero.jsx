"use client";
import { SlidersHorizontal, Play, X } from "lucide-react";
import PropertySearchForm from "../Properties/PropertySearchForm";
import { useState } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-24 lg:py-24 text-white z-0 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800"
        animate={{
          background: [
            "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #1d4ed8 100%)",
            "linear-gradient(135deg, #1d4ed8 0%, #1e40af 50%, #5a47fb 100%)",
            "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 border border-white/10 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-16 h-16 border border-white/10 rounded-lg rotate-45"
        animate={{
          y: [0, 15, 0],
          rotate: [45, 90, 45],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-1/4 w-12 h-12 border border-white/10 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Real Estate Themed Floating Elements */}

      {/* House 1 */}
      <motion.div
        className="absolute top-32 left-1/3 text-white/20"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
        </svg>
      </motion.div>

      {/* Building 1 */}
      <motion.div
        className="absolute top-16 right-1/4 text-white/15"
        animate={{
          y: [0, 20, 0],
          x: [0, -8, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z" />
        </svg>
      </motion.div>

      {/* Key */}
      <motion.div
        className="absolute bottom-32 right-1/3 text-white/25"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
        </svg>
      </motion.div>

      {/* House 2 */}
      <motion.div
        className="absolute top-1/2 left-16 text-white/18"
        animate={{
          y: [0, 12, 0],
          x: [0, -5, 0],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M19 9.3V4h-3v2.6L12 3L2 12h3v8h5v-6h4v6h5v-8h3L19 9.3z" />
        </svg>
      </motion.div>

      {/* Building 2 */}
      <motion.div
        className="absolute bottom-16 left-1/2 text-white/12"
        animate={{
          y: [0, -18, 0],
          x: [0, 12, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z" />
        </svg>
      </motion.div>

      {/* Dollar Sign */}
      <motion.div
        className="absolute top-1/3 right-16 text-white/20"
        animate={{
          y: [0, 8, 0],
          rotate: [0, 10, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
        </svg>
      </motion.div>

      {/* Location Pin */}
      <motion.div
        className="absolute bottom-1/3 right-8 text-white/15"
        animate={{
          y: [0, -12, 0],
          x: [0, 6, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      </motion.div>

      {/* Contract/Document */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-white/18"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -8, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
        </svg>
      </motion.div>

      {/* Small Houses */}
      <motion.div
        className="absolute top-3/4 left-1/3 text-white/10"
        animate={{
          y: [0, -8, 0],
          x: [0, 4, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-1/3 text-white/12"
        animate={{
          y: [0, 10, 0],
          x: [0, -3, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
        </svg>
      </motion.div>

      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
        {/* Left: Text + Search */}
        <motion.div
          className="lg:w-1/2 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-10">
            {/* Hook statement with improved readability */}
            <motion.h1
              className="font-raleway text-2xl sm:text-2xl lg:text-4xl font-extrabold tracking-wide mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Real estate transactions like online shopping
            </motion.h1>
          </div>

          {/* PropertySearchForm with Filter Button */}
          <motion.div
            className="relative z-10 w-full max-w-3xl sm:max-w-xl md:max-w-2xl lg:max-w-none flex items-center gap-3 bg-white/90 shadow-lg rounded-full px-3 py-2 border border-gray-300 focus-within:ring-2 ring-primary-500 transition-all backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
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
          </motion.div>
        </motion.div>

        {/* Right: Video */}
        <motion.div
          className="lg:w-1/2 w-full max-w-lg mx-auto lg:mx-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black">
            {!showVideo ? (
              <>
                {/* Video Thumbnail/Poster */}
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <img
                    src={`https://img.youtube.com/vi/cJJYhN-JSWc/maxresdefault.jpg`}
                    alt="How it works video thumbnail"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                  {/* Play Button Overlay */}
                  <motion.button
                    onClick={() => setShowVideo(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative">
                      {/* Pulsing background effect */}
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
                      {/* Main button */}
                      <div className="relative w-20 h-20 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/40 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl border border-white/20">
                        <Play className="w-10 h-10 ml-1 text-white drop-shadow-sm" />
                      </div>
                    </div>
                  </motion.button>
                </div>
                {/* Video Title */}
                <div className="p-4 bg-white/10 backdrop-blur-sm text-center">
                  {/* <h3 className="text-lg font-semibold text-white">
                    How it works
                  </h3> */}
                  <p className="text-sm text-gray-200">
                    See how it works in a few minutes
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Video Player */}
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
                  {/* Close Button */}
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
    </section>
  );
};

export default Hero;
