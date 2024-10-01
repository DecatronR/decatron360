import FeaturedProperties from "@/components/FeaturedProperties";
import Hero from "@/components/Hero";
import HomeProperties from "@/components/HomeProperties";
import InfoBoxes from "@/components/InfoBoxes";
import CategoriesCarousel from "@/components/CategoriesCarousel";

const HomePage = () => {
  return (
    <>
      <Hero />
      {/* <InfoBoxes /> */}
      <CategoriesCarousel />
      <HomeProperties />
    </>
  );
};

export default HomePage;
