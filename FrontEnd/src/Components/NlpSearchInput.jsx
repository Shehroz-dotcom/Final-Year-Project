import { memo, useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Urls from '../utils/Urls.js';
import foodPlaceholder from '../assets/paul-lichtblau-13khUlRITD8-unsplash.jpg';
import {useNavigate} from "react-router-dom"

const NlpSearchInput = () => {
  const navigate = useNavigate()
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
      console.log('Search results:', response.data);
    } catch (error) {
      console.error('Search API error:', error.response?.data || error.message);
      setResults([]);
      setIsExpanded(false);
    } finally {
      setLoading(false);
    }
  };
  console.log("results = " , results);
  

  // Close panel if clicking outside
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

  // Enable mouse wheel horizontal scroll for results
  useEffect(() => {
    const el = containerRef.current?.querySelector('.overflow-x-auto');
    if (!el) return;

    const onWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [results]);

  return (
    <div className="w-full my-8 px-4 sm:px-6 lg:px-8" ref={containerRef}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className={`
            flex items-center gap-3 rounded-2xl border bg-black px-4 py-3
            shadow-sm transition-all duration-300 ease-out
            focus-within:-translate-y-0.5 focus-within:shadow-lg
            ${errors.query ? 'border-red-500' : 'border-black'}
          `}
          onClick={() => setIsExpanded(true)}
        >
          <input
            type="text"
            placeholder="I want foods ... "
            className="flex-1 bg-transparent text-white placeholder-white caret-white outline-none"
            {...register('query', {
              required: 'Search query is required',
              minLength: { value: 2, message: 'At least 2 characters' },
            })}
          />

          <button
            type="submit"
            className="
              rounded-xl bg-white px-5 py-2.5 text-sm cursor-pointer text-black font-bold
              shadow-[0_0_12px_rgba(255,255,255,0.6)]
              transition-all duration-200
              hover:-translate-y-0.5 hover:bg-gray-200
              hover:shadow-[0_0_18px_rgba(255,255,255,0.85)]
              active:scale-95
            "
          >
            {loading ? 'Searching' : 'Search'}
          </button>
        </div>
      </form>

      {/* Results panel */}
      <div
        className={`
          mt-4 w-full overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-[60vh] p-2' : 'max-h-0 p-0'}
        `}
      >
        {isExpanded && results.length > 0 && (
          <div className="bg-black rounded-lg p-2">
            <div className="flex gap-4 overflow-x-auto py-2 cursor-pointer">
              {results.map((f, idx) => (
                <div
                  key={idx}
                  className="min-w-[280px] max-w-[280px] h-[50vh] bg-[#0d0d0d] text-white rounded-lg shadow-lg overflow-hidden flex-shrink-0 transition-transform duration-150 hover:scale-[1.03]"
                >
                  <div onClick={()=> navigate(`/food/${f.id}`)} className="relative w-full h-1/2 overflow-hidden">
                    <img
                      src={f.food_image_url || foodPlaceholder}
                      alt={f.food_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 flex flex-col gap-1 h-1/2 overflow-hidden">
                    <h2 className="text-md font-bold text-[#f9f6f2] line-clamp-1">
                      {f.food_name}
                    </h2>
                    <p className="text-sm text-[#c9c9c9] line-clamp-3">
                      {f.food_description}
                    </p>
                    <p className="text-[#02b11f] font-semibold text-sm">
                      PKR {f.food_price}
                    </p>
                    <p className="text-white text-xs">
                      Category: {f.food_category}
                    </p>
                    {f.food_calories && (
                      <p className="text-white text-xs">
                        Calories: {f.food_calories}
                      </p>
                    )}
                    {f.protein && (
                      <p className="text-white text-xs">
                        Protein: {f.protein}g
                      </p>
                    )}
                    {f.serving_size_g && (
                      <p className="text-white text-xs">
                        Serving Size: {f.serving_size_g}g
                      </p>
                    )}
                    <p className="text-white text-xs">
                      Similarity: {f.similarity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isExpanded && !loading && results.length === 0 && (
          <p className="text-gray-300 mt-4">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default memo(NlpSearchInput);
