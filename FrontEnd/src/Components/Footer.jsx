import { memo } from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white px-6 py-8 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-center md:items-start gap-6">
        
        {/* Logo Section */}
        <div className="flex-1 flex justify-center md:justify-start">
          <div className="text-xl md:text-2xl font-bold">Eatelligence</div>
        </div>
        
        {/* Links Section */}
        <div className="flex-1 flex flex-col items-center md:flex-row md:justify-end gap-4">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            Menu
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
          <a href="#" className="hover:underline">
            About
          </a>
        </div>
      </div>
    </footer>
  );
};



export default memo(Footer);