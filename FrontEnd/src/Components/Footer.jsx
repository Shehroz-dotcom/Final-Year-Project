import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-black/100 backdrop-blur-md text-white px-6 py-12 md:px-12 lg:px-24 border-t border-green-500/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Logo + Description */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2
            onClick={() => navigate("/")}
            className="text-2xl md:text-3xl font-bold mb-2 cursor-pointer hover:text-green-400 transition-colors"
          >
            Eatelligence
          </h2>
          <p className="text-sm text-gray-300">
            Innovative meals for smarter living.
          </p>
        </div>

        {/* About Section */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-green-400 mb-3">
            About Us
          </h3>
          <p className="text-sm text-gray-300">
            Eatelligence is a smart food platform focused on healthy,
            affordable meals powered by technology.
          </p>
        </div>

        {/* Contact + Links */}
        <div className="flex flex-col items-center md:items-end gap-4 text-sm">

          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              Contact
            </h3>
            <p className="text-gray-300 cursor-default">
              📧 support@eatelligence.com
            </p>
            <p className="text-gray-300 cursor-default">
              📍 Lahore, Pakistan
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-4 mt-3">

            {["Home", "Menu", "Contact", "About"].map((item) => (
              <button
                key={item}
                onClick={() =>
                  navigate(
                    item === "Home"
                      ? "/"
                      : `/${item.toLowerCase()}`
                  )
                }
                className="cursor-pointer hover:text-green-400 transition-colors"
              >
                {item}
              </button>
            ))}

          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700/50 pt-4 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Eatelligence. All rights reserved.
      </div>
    </footer>
  );
};

export default memo(Footer);
