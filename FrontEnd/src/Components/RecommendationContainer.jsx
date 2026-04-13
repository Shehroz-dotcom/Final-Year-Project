import { memo, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import RecommentationFoodCard from './RecommentationFoodCard.jsx';
import axios from 'axios';
import Urls from '../utils/Urls.js';

const RecommendationContainer = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    const userDataJSON = sessionStorage.getItem('User');
    setHasUser(!!userDataJSON);
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${Urls.dev}/api/v1/user/personalizedRecommendation`,
          { withCredentials: true }
        );

        setRecommendations(response.data.data || []);
      } catch (error) {
        console.error('Recommendation error:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    if (hasUser) fetchRecommendations();
  }, [hasUser]);

  if (!hasUser) return null;

  return (
    <div className="p-4">
      <h2 className="text-white font-bold text-2xl mb-4">
        Recommended for You
      </h2>

      <div className="bg-black/50 backdrop-blur-md rounded-xl p-4">
        {loading ? (
          <p className="text-gray-400">Loading recommendations...</p>
        ) : recommendations.length === 0 ? (
          <p className="text-gray-400">No recommendations yet.</p>
        ) : (
          <Swiper
            spaceBetween={12}
            slidesPerView={3}
            breakpoints={{
              1024: { slidesPerView: 3 },
              640: { slidesPerView: 2 },
              0: { slidesPerView: 1 },
            }}
          >
            {recommendations.map((food) => (
              <SwiperSlide key={food._id}>
                <RecommentationFoodCard
                  name={food.food_name}
                  calories={food.calories}
                  protein={food.protein}
                  image={food.food_image_url}
                  id={food._id}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default memo(RecommendationContainer);
