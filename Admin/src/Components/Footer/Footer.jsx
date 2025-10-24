import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      {" "}
      <footer className="bg-black text-white py-6 mt-10  ">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
          {/* Brand / Logo */}
          <p className="text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Eatelligence. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex space-x-6">
            <NavLink to="#" className="hover:underline">
              About
            </NavLink>
            <NavLink to="#" className="hover:underline">
              Menu
            </NavLink>
            <NavLink to="#" className="hover:underline">
              Contact
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
