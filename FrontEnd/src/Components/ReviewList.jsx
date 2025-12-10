import { memo } from 'react';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="my-6 w-full h-48 border-2 border-green-500 backdrop-blur-md rounded-lg p-4 overflow-y-auto">
        <p className="text-white">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="my-6 w-full h-48 border-2 border-green-500 backdrop-blur-md rounded-lg p-4 overflow-y-auto">
      {reviews.map((item, i) => (
        <div key={i} className="mb-4">
          <p className="text-white mb-1 font-semibold flex items-center gap-2">
            {item.reviewerName}
            <span className="text-yellow-400 text-lg leading-none">
              {'★'.repeat(item.rating)}
            </span>
          </p>

          <p className="text-white mb-2">{item.review}</p>

          <hr className="border-t border-green-500" />
        </div>
      ))}
    </div>
  );
};

export default memo(ReviewList);
