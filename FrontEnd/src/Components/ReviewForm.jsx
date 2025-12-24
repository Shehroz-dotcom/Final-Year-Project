import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FaStar } from 'react-icons/fa';
import Urls from '../utils/Urls';

const ReviewForm = ({ foodId, userName }) => {
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

  const onSubmit = async (data) => {
    try {
      if (!userName) {
        console.error('Missing userId');
        return;
      }
      if (!foodId) {
        console.error('Missing foodId');
        return;
      }

      const payload = {
        foodId,
        userName: userName,
        review: data.review,
        rating: data.rating,
      };

      const response = await axios.post(
        `${Urls.dev}/api/v1/review/addReview`,
        payload
      );

      reset();
    } catch (error) {
      console.error(
        'Error submitting review:',
        error.response?.data || error.message
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Rating */}
      <label className="text-amber-400 font-bold text-2xl mt-4">Rating</label>
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

      {/* Review input */}
      <h3 className="text-xl font-bold text-amber-400 mb-4">Write a Review</h3>

      <input
        type="text"
        className="w-full px-4 py-2 border border-green-400 bg-transparent 
                   backdrop-blur-sm outline-none text-white placeholder-gray-300 rounded-lg"
        placeholder="Write your review..."
        {...register('review', {
          required: 'Review cannot be empty',
          minLength: {
            value: 10,
            message: 'Review must be 10 characters long',
          },
        })}
      />

      {errors.review && (
        <p className="text-red-400 text-sm mt-1">{errors.review.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg 
                   hover:bg-green-400 transition font-bold cursor-pointer"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
