import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PropertyImages = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, // Enable arrows for navigation
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
  };

  return (
    <section className="relative bg-gray-100 rounded-lg overflow-hidden shadow-md">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image.path}
              alt={`Property Image ${index + 1}`}
              className="w-full h-96 object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
              <span className="text-white text-lg font-bold">
                Property Image {index + 1}
              </span>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

const CustomArrow = ({ direction, onClick }) => {
  return (
    <div
      className={`absolute top-1/2 transform -translate-y-1/2 ${
        direction === "prev" ? "left-4" : "right-4"
      } z-10 cursor-pointer text-gray-700 hover:text-gray-900 transition duration-300`}
      onClick={onClick}
    >
      {direction === "prev" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );
};

export default PropertyImages;
