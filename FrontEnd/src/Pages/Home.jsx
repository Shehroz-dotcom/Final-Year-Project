import { memo, useEffect, useContext } from 'react';
import HeroSection from '../Components/HeroSection.jsx';
import FoodCardContainer from '../Components/foodCardContainer.jsx';
import { AuthContext } from '../Context/AuthContext/AuthContext.jsx';
import RecommendationContainer from '../Components/RecommendationContainer.jsx';
import NlpSearchInput from '../Components/NlpSearchInput.jsx';

const Home = () => {
  const { checkAuth } = useContext(AuthContext);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      {' '}
      <NlpSearchInput/>
      <HeroSection />
      <RecommendationContainer />
      <FoodCardContainer />
    </div>
  );
};

export default memo(Home);
