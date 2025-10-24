import React from "react";
import logo from "../../assets/Logo.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileIsOpen, setprofileIsOpen] = useState(false);
  const navLinks = [
    { to: "/add", label: "Add Foods" },
    { to: "/list", label: "List Foods" },
    { to: "/orders", label: "Orders" },
  ];
  return (
    <>
      <div className="flex flex-row bg-black justify-between relative border-none">
        <div className="flex items-center ">
          <img
            src={logo}
            alt=""
            className="size-16 m-2 rounded-full cursor-pointer"
          />
          <p class="text-white font-extrabold cursor-pointer transition duration-300 hover:[text-shadow:0_0_10px_rgba(255,255,255,0.8),0_0_20px_rgba(255,255,255,0.6),0_0_30px_rgba(255,255,255,0.4)]">
            Eatelligence
          </p>
        </div>
        {/* desktops navigation */}
        <div className="lg:flex lg:flex-row">
          <div className="lg:flex lg:flex-row items-center hidden">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `m-4 px-4 py-2 rounded-md lg:font-bold transition-colors duration-200 ${
                    isActive
                      ? "bg-white text-black"
                      : "text-white hover:bg-white hover:text-black"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* profile dashboard */}
        {profileIsOpen && (
          <div className=" bg-black absolute top-20 right-10 rounded-bl-sm rounded-br-sm  w-50 px-2 py-2 z-100 border border-gray-400">
            <div className="">
              <NavLink
                to="/signout"
                className="block text-left text-white w-full p-2 border-b-2 border-white hover:bg-white hover:text-black active:bg-gray-500"
              >
                Sign Out
              </NavLink>
              <NavLink
                to="/signout"
                className="block text-left text-white w-full p-2 border-b-2 border-white hover:bg-white hover:text-black active:bg-gray-500"
              >
                Sign Out
              </NavLink>
              <NavLink
                to="/signout"
                className="block text-left text-white w-full p-2 border-b-2 border-white hover:bg-white hover:text-black active:bg-gray-500"
              >
                Sign Out
              </NavLink>
            </div>
          </div>
        )}

        {/* mobile Navigations */}

        <div className="flex justify-center items-center z-99 ">
          <img
            onClick={() => setprofileIsOpen(!profileIsOpen)}
            src={logo}
            alt=""
            className="size-10 m-2 rounded-full cursor-pointer"
          />
          <button onClick={() => setIsOpen(!isOpen)}>
            <GiHamburgerMenu className="text-white text-3xl active:bg-gray-600 rounded-md m-4 lg:hidden md:hidden" />
            {isOpen && (
              <div className="absolute top-16 left-0 w-full bg-black text-white p-4 flex flex-col ">
                {navLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end
                    className={({ isActive }) =>
                      `m-4 px-4 py-2 rounded-md lg:font-bold transition-colors duration-200 ${
                        isActive
                          ? "bg-white text-black"
                          : "text-white hover:bg-white hover:text-black"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
