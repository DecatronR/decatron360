"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaHome,
  FaStore,
  FaBriefcase,
  FaBuilding,
  FaCity,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";

// Category Data
const categories = [
  {
    title: "Duplexes",
    icon: <FaBuilding size={20} />,
    link: "/properties/categories/duplexes",
  },
  {
    title: "Bungalows",
    icon: <FaHome size={20} />,
    link: "/properties/categories/bungalows",
  },
  {
    title: "Newly Built",
    icon: <FaHome size={20} />,
    link: "/properties/categories/newly-built",
  },
  {
    title: "Off-Plan",
    icon: <FaBuilding size={20} />,
    link: "/properties/categories/off-plan",
  },
  {
    title: "Shops",
    icon: <FaStore size={20} />,
    link: "properties/categories/shops",
  },
  {
    title: "Offices",
    icon: <FaBriefcase size={20} />,
    link: "properties/categories/office-spaces",
  },
  {
    title: "Abuja",
    icon: <FaCity size={20} />,
    link: "properties/categories/abuja",
  },
];

const CategoriesCarousel = () => {
  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    draggable: false,
    swipe: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="my-8">
      <Slider {...settings}>
        {categories.map((category, index) => (
          <div key={index} className="flex flex-col items-center p-4">
            <Link href={category.link} passHref>
              <div className="flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105">
                <div className="bg-white rounded-full shadow-md p-4 flex justify-center items-center">
                  {category.icon}
                </div>
                <span className="mt-2 text-center text-gray-800 font-semibold hover:text-primary-500">
                  {category.title}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} text-white bg-primary-500 rounded-full shadow-md`}
      style={{ ...style, display: "block", left: "15px", zIndex: 1 }}
      onClick={onClick}
    >
      <FaAngleLeft size={24} />
    </button>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} text-primary-500 bg-white rounded-full shadow-md`}
      style={{ ...style, display: "block", right: "10px", zIndex: 1 }}
      onClick={onClick}
    >
      <FaAngleRight size={24} />
    </button>
  );
};

export default CategoriesCarousel;
