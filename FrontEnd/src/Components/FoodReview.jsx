import { useState } from 'react';
import ReviewForm from "./ReviewForm";
import ReviewList from './ReviewList';

const FoodReviews = ({ foodId, userName, initialReviews }) => {
  const [reviews, setReviews] = useState(initialReviews || []);

  // Function to add a new review to the top
  const addReviewToList = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <div>
      <ReviewForm
        foodId={foodId}
        userName={userName}
        onSuccess={(reviewData) => addReviewToList(reviewData)} // Pass callback
      />
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default FoodReviews;
