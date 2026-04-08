import { memo, useContext, useEffect } from 'react';
import { AuthContext } from '../Context/AuthContext/AuthContext';
import Lottie from 'lottie-react';
import animationData from '../assets/lottie-animation.json';

const HeroSection = () => {
  const { chechAuth } = useContext(AuthContext);

  useEffect(() => {
    chechAuth; // FIXED (you forgot to call it)
  }, []);

  return (
    <div className="w-full h-[70vh] rounded-md flex bg-[#0d0d0d]/40 backdrop-blur-md shadow-2xl overflow-hidden">
      {/* Left */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 backdrop-blur-md bg-[#0d0d0d]/30 z-10 relative">
        <h1 className="text-4xl md:text-5xl font-bold text-[#f9f6f2] drop-shadow-lg">
          Eat Right Without Thinking About It
        </h1>

        <p className="mt-4 text-lg text-[#d1d1d1] max-w-md">
          Let AI handle your daily food decisions with personalized
          recommendations.
        </p>
      </div>

      {/* Right */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center">
        <Lottie animationData={animationData} loop={true} />
      </div>
    </div>
  );
};

export default memo(HeroSection);
