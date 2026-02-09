import { memo, useContext, useEffect } from 'react';
import { AuthContext } from '../Context/AuthContext/AuthContext';
import video from "../assets/video.mp4";

const HeroSection = () => {
  const { chechAuth } = useContext(AuthContext);

  useEffect(() => {
    chechAuth; // call the function correctly
  }, []);

  return (
    <div className="w-full h-[70vh] rounded-md flex bg-[#0d0d0d]/40 backdrop-blur-md shadow-2xl overflow-hidden">
      {/* Left Side (Text Section) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 backdrop-blur-md bg-[#0d0d0d]/30 z-10 relative">
        <h1 className="text-4xl md:text-5xl font-bold text-[#f9f6f2] drop-shadow-lg">
          Eat Smarter with AI
        </h1>
        <p className="mt-4 text-lg text-[#d1d1d1] max-w-md">
          Personalized, healthy, and delicious meals crafted with AI — delivered
          fresh to your door.
        </p>
      </div>

      {/* Right Side (Video Section) */}
      <div className="hidden md:flex md:w-1/2 relative items-center justify-center overflow-hidden">
        <video
          src={video}
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default memo(HeroSection);
