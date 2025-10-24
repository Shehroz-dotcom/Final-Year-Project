import { memo, useEffect, useContext } from 'react';
import HeroSection from '../Components/HeroSection.jsx';
import FoodCardContainer from '../Components/foodCardContainer.jsx';
import { AuthContext } from '../Context/AuthContext/AuthContext.jsx';

const Home = () => {
  const { checkAuth } = useContext(AuthContext);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      {' '}
      <HeroSection />
      <FoodCardContainer />
    </div>
  );
};

export default memo(Home);
