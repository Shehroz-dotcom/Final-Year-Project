import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Urls from '../utils/Urls';

const ReviewForm = ({ foodId, userName, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      review: '',
      rating: 0,
    },
  });

  const rating = watch('rating');
  const review = watch('review', '');

  const onSubmit = async (data) => {
    try {
      if (!userName || !foodId) return;

      const payload = {
        foodId,
        userName,
        review: data.review,
        rating: data.rating,
      };

      await axios.post(`${Urls.dev}/api/v1/review/addReview`, payload);

      toast.success('Review added successfully');
      reset();

      // Send new review to parent to show instantly
      onSuccess?.({
        reviewerName: userName,
        review: data.review,
        rating: data.rating,
      });
    } catch (error) {
      console.error(
        'Error submitting review:',
        error.response?.data || error.message
      );
      toast.error('Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <label className="text-amber-400 font-bold text-2xl mb-2">Rating</label>
      <div className="flex space-x-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue('rating', star)}
            className={`text-2xl transition-colors duration-200 cursor-pointer ${
              star <= rating ? 'text-yellow-400' : 'text-gray-600'
            }`}
          >
            <FaStar />
          </button>
        ))}
      </div>

      <h3 className="text-xl font-bold text-amber-400 mb-2">Write a Review</h3>
      <input
        type="text"
        className="w-full px-4 py-2 border border-green-400 bg-transparent 
                   backdrop-blur-sm outline-none text-white placeholder-gray-300 rounded-lg"
        placeholder="Write your review..."
        {...register('review', {
          required: 'Review cannot be empty',
          minLength: {
            value: 10,
            message: 'Review must be at least 10 characters long',
          },
        })}
      />
      {errors.review && (
        <p className="text-red-400 text-sm mt-1">{errors.review.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || review.length < 10}
        className={`mt-4 px-4 py-2 rounded-lg font-bold transition cursor-pointer ${
          isSubmitting || review.length < 10
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-400 text-white'
        }`}
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
