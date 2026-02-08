import { memo, useRef, useEffect } from 'react';
import RecommentationFoodCard from './RecommentationFoodCard.jsx';

const recommendations = [
  {
    id: 1,
    name: 'Grilled Chicken',
    calories: 250,
    protein: 30,
    image: '/images/chicken.jpg',
  },
  {
    id: 2,
    name: 'Avocado Salad',
    calories: 150,
    protein: 5,
    image: '/images/avocado.jpg',
  },
  {
    id: 3,
    name: 'Oatmeal Bowl',
    calories: 200,
    protein: 8,
    image: '/images/oatmeal.jpg',
  },
  {
    id: 4,
    name: 'Salmon Fillet',
    calories: 300,
    protein: 35,
    image: '/images/salmon.jpg',
  },
  {
    id: 5,
    name: 'Greek Yogurt',
    calories: 100,
    protein: 10,
    image: '/images/yogurt.jpg',
  },
  {
    id: 6,
    name: 'Grilled Chicken',
    calories: 250,
    protein: 30,
    image: '/images/chicken.jpg',
  },
  {
    id: 7,
    name: 'Avocado Salad',
    calories: 150,
    protein: 5,
    image: '/images/avocado.jpg',
  },
  {
    id: 8,
    name: 'Oatmeal Bowl',
    calories: 200,
    protein: 8,
    image: '/images/oatmeal.jpg',
  },
  {
    id: 9,
    name: 'Salmon Fillet',
    calories: 300,
    protein: 35,
    image: '/images/salmon.jpg',
  },
  {
    id: 10,
    name: 'Greek Yogurt',
    calories: 100,
    protein: 10,
    image: '/images/yogurt.jpg',
  },
];

const RecommendationContainer = () => {
  const scrollRef = useRef(null);

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

  return (
    <div className="p-4">
      <h2 className="text-white font-bold text-2xl mb-4">
        Recommended for You
      </h2>

      {/* Blurred dark background wrapper */}
      <div className="bg-black/50 backdrop-blur-md rounded-xl p-4">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-gray-500"
        >
          {recommendations.map((food) => (
            <RecommentationFoodCard
              key={food.id}
              name={food.name}
              calories={food.calories}
              protein={food.protein}
              image={food.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(RecommendationContainer);
