import { memo } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const baseClasses = 'block px-4 py-2 rounded-lg transition-all duration-200';

  return (
    <div className="w-48 h-screen bg-white/10 backdrop-blur-md p-4 space-y-3 border border-white/20 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Sidebar</h2>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive
            ? `${baseClasses} bg-green-600 text-white font-bold`
            : `${baseClasses} text-gray-800`
        }
      >
        User Profile
      </NavLink>

      <NavLink
        to="/macronutrients"
        className={({ isActive }) =>
          isActive
            ? `${baseClasses} bg-green-600 text-white font-bold`
            : `${baseClasses} text-gray-800`
        }
      >
        Macronutrients
      </NavLink>
    </div>
  );
};

export default memo(Sidebar);
