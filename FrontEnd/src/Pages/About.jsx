import React from 'react';
import aboutImg from '../assets/paul-lichtblau-13khUlRITD8-unsplash.jpg';

const About = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-transparent">
      <div className="max-w-[1400px] mx-auto">
        <div
          className="
            bg-black/70 backdrop-blur-md 
            border border-white/10 
            rounded-2xl sm:rounded-3xl 
            p-6 sm:p-10 md:p-14 lg:p-16
            flex flex-col lg:flex-row 
            items-center gap-10 lg:gap-16
            shadow-2xl
          "
        >
          {/* TEXT SECTION */}
          <div className="w-full lg:w-2/5 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              About Our Food App
            </h1>

            <h3 className="text-lg sm:text-xl md:text-2xl text-green-400 mb-6">
              Healthy delights, fresh food everyday
            </h3>

            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              Our food app delivers fresh, healthy, and delicious meals straight
              to your doorstep while maintaining hygiene and quality.
            </p>

            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
              We make food ordering simple, fast, and reliable while promoting
              nutritious eating habits for everyone.
            </p>
          </div>

          {/* IMAGE SECTION (BIGGER FOCUS) */}
          <div className="w-full lg:w-3/5 flex justify-center lg:justify-end">
            <img
              src={aboutImg}
              alt="Healthy Food"
              className="
                w-full 
                max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl
                rounded-xl sm:rounded-2xl 
                shadow-2xl 
                border border-white/10
                object-cover
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
