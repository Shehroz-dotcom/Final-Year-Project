import React from "react";
import aboutImg from "../assets/paul-lichtblau-13khUlRITD8-unsplash.jpg";

const About = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-transparent">
      <div className="max-w-7xl mx-auto">

        {/* Glass Card */}
        <div
          className="
            bg-black/70 backdrop-blur-md 
            border border-white/10 
            rounded-2xl sm:rounded-3xl 
            p-6 sm:p-8 md:p-12 lg:p-14
            flex flex-col lg:flex-row 
            items-center gap-8 sm:gap-10 lg:gap-12
            shadow-2xl
          "
        >

          {/* TEXT SECTION */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
              About Our Food App
            </h1>

            <h3 className="text-lg sm:text-xl text-green-400 mb-4 sm:mb-6">
              Healthy delights, fresh food everyday
            </h3>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
              Our food app delivers fresh, healthy, and delicious meals
              straight to your doorstep while maintaining hygiene and quality.
            </p>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              We make food ordering simple, fast, and reliable while promoting
              nutritious eating habits for everyone.
            </p>
          </div>

          {/* IMAGE SECTION */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src={aboutImg}
              alt="Healthy Food"
              className="
                w-full 
                max-w-xs sm:max-w-sm md:max-w-md 
                rounded-xl sm:rounded-2xl 
                shadow-lg 
                border border-white/10
              "
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;