import { memo, useEffect, useState, useContext } from 'react';
import Slider from 'react-slick';
import RecommentationFoodCard from './RecommentationFoodCard.jsx';
import { FoodContext } from '../Context/FoodContext/FoodContext.jsx';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const RecommendationContainer = () => {
  const { foodData } = useContext(FoodContext);
  const [recommendations, setRecommendations] = useState([]);
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    const userDataJSON = sessionStorage.getItem('User');
    setHasUser(!!userDataJSON);
  }, []);

  useEffect(() => {
    if (!foodData || !hasUser) return;

    const userData = JSON.parse(sessionStorage.getItem('User'));
    const consumedAttrs = userData.consumedFoodAttributes || [];

    const consumedTags = new Set();
    const consumedSuitability = new Set();
    const consumedDiet = new Set();

    consumedAttrs.forEach((attr) => {
      attr.tags?.forEach((tag) => consumedTags.add(tag));
      attr.suitability?.forEach((suit) => consumedSuitability.add(suit));
      attr.diet_compatibility?.forEach((d) => consumedDiet.add(d));
    });

    const filteredRecommendations = foodData.filter((food) => {
      if (!food) return false;

      const matchesTag = food.tags?.some((tag) => consumedTags.has(tag));
      const matchesSuitability = food.suitability?.some((suit) =>
        consumedSuitability.has(suit)
      );
      const matchesDiet = food.diet_compatibility?.some((d) =>
        consumedDiet.has(d)
      );

      return matchesTag || matchesSuitability || matchesDiet;
    });

    setRecommendations(filteredRecommendations);
  }, [foodData, hasUser]);

  if (!hasUser) return null;

  // Slider settings
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3, // adjust as needed
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-white font-bold text-2xl mb-4">
        Recommended for You
      </h2>

      <div className="bg-black/50 backdrop-blur-md rounded-xl p-4">
        {recommendations.length === 0 ? (
          <p className="text-gray-400">No recommendations yet.</p>
        ) : (
          <Slider {...settings}>
            {recommendations.map((food) => (
              <div key={food._id} className="px-2">
                <RecommentationFoodCard
                  name={food.food_name}
                  calories={food.calories}
                  protein={food.protein}
                  image={food.food_image_url}
                  id={food._id}
                />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default memo(RecommendationContainer);
