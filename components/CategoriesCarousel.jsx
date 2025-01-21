"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaHome,
  FaWarehouse,
  FaStore,
  FaBuilding,
  FaCity,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import Spinner from "./Spinner";

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
    title: "Offplan",
    icon: <FaBuilding size={20} />,
    link: "/properties/categories/offplan",
  },
  { title: "Shops", icon: <FaStore size={20} />, link: "/categories/shops" },
  {
    title: "Warehouses",
    icon: <FaWarehouse size={20} />,
    link: "/properties/categories/warehouses",
  },
  {
    title: "Abuja",
    icon: <FaCity size={20} />,
    link: "properties/categories/abuja",
  },
];

const CategoriesCarousel = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  // Render loading state or carousel based on loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-gray-500">
          <Spinner />
        </span>
      </div>
    );
  }

  return (
    <div className="my-8">
      {/* <h2 className="text-3xl font-bold mb-4 text-center text-primary-500">
        Categories
      </h2> */}
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
