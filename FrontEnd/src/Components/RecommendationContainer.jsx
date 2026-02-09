import { memo, useRef, useEffect, useState, useContext } from 'react';
import RecommentationFoodCard from './RecommentationFoodCard.jsx';
import { FoodContext } from '../Context/FoodContext/FoodContext.jsx';

const RecommendationContainer = () => {
  const scrollRef = useRef(null);
  const { foodData } = useContext(FoodContext);
  const [recommendations, setRecommendations] = useState([]);
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    // Check if User exists in session storage
    const userDataJSON = sessionStorage.getItem('User');
    if (userDataJSON) {
      setHasUser(true);
    } else {
      setHasUser(false);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    if (!foodData || !hasUser) return;

    const userData = JSON.parse(sessionStorage.getItem('User'));
    const consumedAttrs = userData.consumedFoodAttributes || [];

    const consumedTags = new Set();
    const consumedSuitability = new Set();
    const consumedDiet = new Set();
    const consumedFoodIds = new Set();

    consumedAttrs.forEach((attr) => {
      attr.food && consumedFoodIds.add(attr.food);
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

  if (!hasUser) return null; // hide the entire container if no User

  return (
    <div className="p-4">
      <h2 className="text-white font-bold text-2xl mb-4">
        Recommended for You
      </h2>

      <div className="bg-black/50 backdrop-blur-md rounded-xl p-4">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-gray-500"
        >
          {recommendations.length === 0 ? (
            <p className="text-gray-400">No recommendations yet.</p>
          ) : (
            recommendations.map((food) => (
              <RecommentationFoodCard
                key={food._id}
                name={food.food_name}
                calories={food.calories}
                protein={food.protein}
                image={food.food_image_url}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(RecommendationContainer);
