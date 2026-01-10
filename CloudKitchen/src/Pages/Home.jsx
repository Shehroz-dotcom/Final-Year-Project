import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="w-full max-w-2xl text-center p-10 rounded-2xl
                   bg-black/20 backdrop-blur-xl
                   border border-white/20 shadow-2xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-10">
          Welcome to Cloud Kitchen
        </h1>

        <div className="flex justify-center gap-6">
          <button
            onClick={() => navigate("/register")}
            className="
    px-8 py-3 rounded-md
    bg-black text-white
    border border-white
    transition
    hover:bg-white hover:text-black
    font-medium cursor-pointer
  "
          >
            Register
          </button>

          <button
            onClick={() => navigate("/login")}
            className="
    px-8 py-3 rounded-md
    bg-white text-black
    border border-transparent
    transition
    hover:bg-black hover:text-white hover:border-white
    font-medium cursor-pointer
  "
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);
