"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Building,
  Home,
  Store,
  Briefcase,
  Landmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const CategoriesCarousel = () => {
  const [iconSize, setIconSize] = useState(20);

  // Adjust icon size based on screen width
  useEffect(() => {
    const updateIconSize = () => {
      if (window.innerWidth < 480) {
        setIconSize(16);
      } else if (window.innerWidth < 768) {
        setIconSize(18);
      } else {
        setIconSize(20);
      }
    };

    updateIconSize();
    window.addEventListener("resize", updateIconSize);
    return () => window.removeEventListener("resize", updateIconSize);
  }, []);

  // Category Data
  const categories = [
    {
      title: "Duplexes",
      icon: <Building size={iconSize} />,
      link: "/properties/categories/duplexes",
    },
    {
      title: "Bungalows",
      icon: <Home size={iconSize} />,
      link: "/properties/categories/bungalows",
    },
    {
      title: "Newly Built",
      icon: <Home size={iconSize} />,
      link: "/properties/categories/newly-built",
    },
    {
      title: "Off-Plan",
      icon: <Building size={iconSize} />,
      link: "/properties/categories/off-plan",
    },
    {
      title: "Shops",
      icon: <Store size={iconSize} />,
      link: "/properties/categories/shops",
    },
    {
      title: "Offices",
      icon: <Briefcase size={iconSize} />,
      link: "/properties/categories/office-spaces",
    },
    {
      title: "Abuja",
      icon: <Landmark size={iconSize} />,
      link: "/properties/categories/abuja",
    },
  ];

  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    draggable: true,
    swipe: true,
    touchMove: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 7 } },
      { breakpoint: 768, settings: { slidesToShow: 4 } },
      { breakpoint: 480, settings: { slidesToShow: 4 } },
    ],
  };

  return (
    <div className="relative my-8">
      <Slider {...settings}>
        {categories.map((category, index) => (
          <div key={index} className="flex flex-col items-center p-4">
            <Link href={category.link} passHref>
              <div className="flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105">
                <div className="bg-white rounded-full shadow-md p-3 flex justify-center items-center">
                  {category.icon}
                </div>
                {/* Responsive Text Size */}
                <span className="mt-2 text-center font-semibold text-sm md:text-sm lg:text-sm hover:text-primary-500">
                  {category.title}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </Slider>

      {/* Custom Arrows */}
      <button
        className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
        onClick={() => document.querySelector(".slick-prev")?.click()}
      >
        <ChevronLeft size={iconSize} />
      </button>

      <button
        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
        onClick={() => document.querySelector(".slick-next")?.click()}
      >
        <ChevronRight size={iconSize} />
      </button>
    </div>
  );
};

export default CategoriesCarousel;
