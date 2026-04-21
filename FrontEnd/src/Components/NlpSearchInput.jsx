import { memo, useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Urls from '../utils/Urls.js';
import foodPlaceholder from '../assets/paul-lichtblau-13khUlRITD8-unsplash.jpg';
import { useNavigate } from 'react-router-dom';

const NlpSearchInput = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const query = data.query.trim();
    if (!query) return;

    setLoading(true);
    try {
      const response = await axios.get(`${Urls.dev}/api/v1/nlp/nlpSearch`, {
        params: { query },
      });

      setResults(response.data.results || []);
      setIsExpanded(true);
    } catch (error) {
      console.error(error);
      setResults([]);
      setIsExpanded(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="relative w-full my-8 px-4 sm:px-6 lg:px-8"
      ref={containerRef}
    >
      {/* SEARCH BAR */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className={`
            flex items-center gap-3 rounded-2xl border bg-black px-4 py-3
            shadow-sm transition-all duration-300
            focus-within:shadow-lg
            ${errors.query ? 'border-red-500' : 'border-white/10'}
          `}
        >
          <input
            type="text"
            placeholder="Food catogery..."
            className="flex-1 bg-transparent text-white placeholder-white outline-none"
            {...register('query', {
              required: 'Search query is required',
              minLength: { value: 2, message: 'At least 2 characters' },
            })}
          />

          <button
            type="submit"
            className="bg-white text-black px-5 py-2 rounded-xl font-bold hover:bg-gray-200 active:scale-95 transition"
          >
            {loading ? 'Searching' : 'Search'}
          </button>
        </div>
      </form>

      {/* RESULTS DROPDOWN (OVERLAY - NO LAYOUT SHIFT) */}
      {isExpanded && (
        <div className="absolute left-0 w-full mt-2 z-50">
          <div className="bg-black rounded-lg shadow-xl border border-white/10 p-2">
            {results.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto py-2">
                {results.map((f, idx) => (
                  <div
                    key={idx}
                    className="min-w-[280px] max-w-[280px] h-[50vh] bg-[#0d0d0d] text-white rounded-lg overflow-hidden flex-shrink-0 hover:scale-[1.03] transition"
                  >
                    {/* IMAGE */}
                    <div
                      onClick={() => navigate(`/food/${f.id}`)}
                      className="h-1/2 cursor-pointer"
                    >
                      <img
                        src={f.food_image_url || foodPlaceholder}
                        alt={f.food_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-3 flex flex-col gap-1 h-1/2 overflow-hidden">
                      <h2 className="font-bold line-clamp-1">{f.food_name}</h2>

                      <p className="text-sm text-gray-300 line-clamp-3">
                        {f.food_description}
                      </p>

                      <p className="text-green-400 font-semibold text-sm">
                        PKR {f.food_price}
                      </p>

                      <p className="text-xs">Category: {f.food_category}</p>

                      {f.food_calories && (
                        <p className="text-xs">Calories: {f.food_calories}</p>
                      )}

                      {f.protein && (
                        <p className="text-xs">Protein: {f.protein}g</p>
                      )}

                      <p className="text-xs">Similarity: {f.similarity}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !loading && <p className="text-gray-300 p-3">No results found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(NlpSearchInput);
