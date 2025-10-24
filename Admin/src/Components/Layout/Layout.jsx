import React from "react";
import bg from "../../assets/paul-lichtblau-13khUlRITD8-unsplash.jpg";
import Footer from "../Footer/Footer.jsx";
import Navbar from "../Navbar/Navbar.jsx";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed border-none "
        style={{ backgroundImage: `url(${bg})` }}
      >
        {children}
      </main>
      {/* footer */}
      <Footer />
    </>
  );
};

export default Layout;
