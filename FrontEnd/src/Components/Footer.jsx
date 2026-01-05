import { memo } from 'react';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 px-6 py-12 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-center md:items-start gap-8">
        {/* Logo Section */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <div className="text-2xl md:text-3xl font-bold text-white mb-2">
            Eatelligence
          </div>
          <p className="text-sm text-gray-400 text-center md:text-left">
            Innovative meals for smarter living.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex-1 flex flex-col md:flex-row items-center md:justify-end gap-6 mt-6 md:mt-0">
          <a href="#" className="hover:text-green-500 transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-green-500 transition-colors">
            Menu
          </a>
          <a href="#" className="hover:text-green-500 transition-colors">
            Contact
          </a>
          <a href="#" className="hover:text-green-500 transition-colors">
            About
          </a>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-8 border-t border-gray-800 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Eatelligence. All rights reserved.
      </div>
    </footer>
  );
};

export default memo(Footer);
