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
  };

  return (
    <section className="relative bg-gray-100">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img
              src={image.path}
              alt={`Image ${index}`}
              className="w-full h-96 object-cover rounded-t-lg"
            />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default PropertyImages;
