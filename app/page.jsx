import FeaturedProperties from '@/components/FeaturedProperties';
import Hero from '@/components/Hero';
import HomeProperties from '@/components/HomeProperties';
import InfoBoxes from '@/components/InfoBoxes';
import Dialog from '@/ui/Dialog';
import LoginForm from '@/components/LoginForm';

const HomePage = ({ isLoginOpen, handleCloseLogin }) => {

  return (
    <>
      <Hero />
      <InfoBoxes />
      <FeaturedProperties />
      <HomeProperties />  
    </>
  );
};

export default HomePage;
