import { memo } from "react";
import { Routes, Route } from "react-router-dom";
import Loginpage from "./Pages/Loginpage.jsx";
import Register from "./Pages/Register.jsx";
import React from "react";
import Home from "./Pages/Home.jsx";
import bg from "../../FrontEnd/src/assets/paul-lichtblau-13khUlRITD8-unsplash.jpg";

const App = () => {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
};

export default memo(App);
