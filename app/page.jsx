import Hero from "components/Home/Hero";
import HomeProperties from "components/Home/HomeProperties";
import CategoriesCarousel from "components/Home/CategoriesCarousel";

const HomePage = () => {
  return (
    <>
      <Hero />
      <CategoriesCarousel />
      <HomeProperties />
    </>
  );
};

export default HomePage;
