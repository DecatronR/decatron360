"use client";
import React, { useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";

const PropertyImages = ({ images }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const displayedImages = images.slice(0, 7);

  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleImageClick = (index) => {
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      setSelectedIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < displayedImages.length - 1) {
      setSelectedIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <>
      <section className="relative bg-gray-100 rounded-lg overflow-hidden shadow-md p-4">
        {/* Adjust the grid layout for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-auto sm:h-[600px]">
          <div
            className="relative group col-span-1 cursor-pointer"
            onClick={() => handleImageClick(0)}
          >
            <img
              src={`${displayedImages[0]?.path}`}
              alt={`Primary Property Image`}
              className="w-full h-64 sm:h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105 rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-lg"></div>
          </div>

          <div className="grid grid-cols-2 gap-2 col-span-1">
            {displayedImages.slice(1).map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
                onClick={() => handleImageClick(index + 1)}
              >
                <img
                  src={`${image.path}`}
                  alt={`Property Image ${index + 2}`}
                  className="w-full h-32 sm:h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105 rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-lg">
                  <span className="text-white text-sm font-bold">
                    Image {index + 2}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Dialog for selected image */}
      <Dialog
        open={selectedIndex !== null}
        onClose={handleClose}
        maxWidth="lg"
        PaperProps={{
          style: { backgroundColor: "transparent", boxShadow: "none" },
        }}
        fullScreen={window.innerWidth < 640}
      >
        <div
          {...handlers}
          className="relative flex justify-center items-center w-full h-full"
        >
          {/* Close button positioned at the top right of the image container */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-lg"
          >
            <X size={24} />
          </button>

          {/* Left arrow for navigating images */}
          {selectedIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-3 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Display the selected image */}
          <img
            src={`${displayedImages[selectedIndex]?.path}`}
            alt="Selected Property"
            className="w-full h-auto object-contain max-h-[90vh] rounded-lg"
          />

          {/* Right arrow for navigating images */}
          {selectedIndex < displayedImages.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-3 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default PropertyImages;
