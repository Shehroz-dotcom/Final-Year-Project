import { memo, useState, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { UserContext } from '../Context/UserContext/UserContext.jsx';
import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TfiShoppingCartFull } from 'react-icons/tfi';
import { CartContext } from '../Context/CartContext/CartContext.jsx';
import AnimatedButton from './AnimatedButton.jsx';
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { userData, setUserData, logout } = useContext(UserContext);
  const { totalCartItems } = useContext(CartContext);

  useEffect(() => {
    // 1️⃣ If context already has userData, mark logged in
    if (userData) {
      setIsLoggedIn(true);
      navigate('/');
      return; // no need to check sessionStorage
    }

    // 2️⃣ Otherwise, check if user exists in sessionStorage
    const storedUser = sessionStorage.getItem('User');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setIsLoggedIn(true);
        navigate('/');
      } catch (err) {
        console.error('Error parsing user data from sessionStorage:', err);
        sessionStorage.removeItem('User'); // clear corrupt data
        setIsLoggedIn(false);
      }
    } else {
      // 3️⃣ No userData and nothing in sessionStorage
      setIsLoggedIn(false);
    }
  }, [userData, setUserData]);

  const handleAuth = async () => {
    if (userData) {
      await logout(); // handles backend + clears state + redirects
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      {/* Navbar for all screen sizes */}
      <div className="relative bg-black px-4 py-4 md:px-12 md:py-6 w-full">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            className="text-white font-bold text-xl md:text-2xl cursor-pointer 
             transition-all duration-300 ease-in-out 
             hover:drop-shadow-[0_0_8px_white] hover:scale-105"
            onClick={() => {
              navigate('/');
            }}
          >
            Eatelligence
          </div>
          <div className="text-white font-bold">Ai Food Recommendation system</div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {/* Only show on md+ screens */}
            {isLoggedIn && (
              <div className="hidden md:flex items-center gap-2">
                {/* Profile placeholder */}
                <div className="w-auto h-auto rounded-md flex items-center justify-center select-none text-black bg-white px-4 py-2 font-bold cursor-pointer">
                  {/* Mobile: first letter only */}
                  <span
                    className="block sm:hidden cursor-pointer"
                    onClick={() => navigate(`/userProfile`)}
                  >
                    {userData?.fullName?.charAt(0).toUpperCase()}
                  </span>
                  {/* carticons */}

                  {/* Desktop: full name */}
                  <span className=" sm:block  lg:flex gap-">
                    {userData?.fullName?.replace(/\s+/g, ' ').trim()}
                  </span>
                </div>
                <Link
                  to="/cart"
                  className="relative flex items-center justify-center bg-white text-black rounded-md px-3 py-2 
             cursor-pointer hover:bg-black hover:text-white transition-all duration-300"
                >
                  {/* Cart Icon */}
                  <TfiShoppingCartFull className="text-2xl" />

                  {/* Item Count Badge */}
                  {totalCartItems > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold
                 rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {totalCartItems}
                    </span>
                  )}
                </Link>
              </div>
            )}

            {/* Desktop login/signout + dropdown */}
            <div className="hidden md:flex items-center gap-3 text-white">
              <AnimatedButton
                label={userData ? 'Logout' : 'Login'}
                onClick={handleAuth}
              />

              <div
                onClick={() => setIsDropDownOpen(!isDropDownOpen)}
                className={`cursor-pointer p-2 rounded-md border border-white transition-colors duration-200 hover:bg-white hover:text-black ${
                  isDropDownOpen ? 'bg-white text-black' : 'bg-black text-white'
                }`}
                role="button"
                aria-expanded={isDropDownOpen}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setIsDropDownOpen(!isDropDownOpen);
                  }
                }}
              >
                <IoIosArrowDown />
              </div>
            </div>

            {/* Mobile only: Profile + Login + Hamburger */}
            <div className="md:hidden flex items-center gap-3">
              {isLoggedIn && userData && (
                <div className="w-auto h-auto rounded-md flex items-center justify-center select-none text-black bg-white px-4 py-2 font-bold cursor-pointer">
                  {userData.fullName}
                </div>
              )}

              {!isLoggedIn && (
                <AnimatedButton
                  onClick={() => navigate('/login')}
                  className="px-4 py-1 text-sm font-bold"
                >
                  Login
                </AnimatedButton>
              )}

              <AnimatedButton
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="px-3 py-2 text-lg font-bold text-white md:hidden"
              >
                {isMobileMenuOpen ? '✕' : '☰'}
              </AnimatedButton>
            </div>
          </div>
        </div>

        {/* Desktop Dropdown Menu */}
        {isDropDownOpen && (
          <ul className="hidden md:flex flex-col absolute right-12 top-16 bg-black border border-white/10 rounded-md w-48 z-50">
            {isLoggedIn ? (
              <>
                <li
                  className="text-white font-bold py-2 px-4 hover:bg-white hover:text-black w-full text-center cursor-pointer border-b-1 border-white"
                  onClick={() => {
                    setIsDropDownOpen(false);
                    navigate('/userProfile'); // removed ID
                  }}
                >
                  Profile
                </li>
                <li
                  className="text-white font-bold py-2 px-4 hover:bg-white hover:text-black w-full text-center cursor-pointer border-b-1 border-white"
                  onClick={() => {
                    setIsDropDownOpen(false);
                    navigate('/userHealthProfile'); // removed ID
                  }}
                >
                  Health Profile
                </li>
                 {/* <li
                  className="text-white font-bold py-2 px-4 hover:bg-white hover:text-black w-full text-center cursor-pointer border-b-1 border-white"
                  onClick={() => {
                    setIsDropDownOpen(false);
                    navigate('/personalizedRecommnedation'); // removed ID
                  }}
                >
                  Personalized Recommendation
                </li> */}

                <li
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center border-b border-white"
                >
                  <Link
                    to="/cart"
                    className="block text-white font-bold py-2 px-4 hover:bg-white hover:text-black w-full cursor-pointer"
                  >
                    Cart
                  </Link>
                </li>
                <li
                  className="text-white font-bold py-2 px-4 hover:bg-white hover:text-black  w-full text-center cursor-pointer border-b-1  border-white"
                  onClick={() => {
                    handleAuth();
                    setIsLoggedIn(false);
                    setIsDropDownOpen(false);
                  }}
                >
                  Logout
                </li>
              </>
            ) : (
              <>
                <li
                  className="text-white font-bold py-2 px-4 hover:bg-white hover:text-black w-full text-center cursor-pointer border-b-1  border-white"
                  onClick={() => navigate('/')}
                >
                  Home
                </li>

                <li className="text-white font-bold py-2 px-4 hover:bg-white hover:text-black  w-full text-center cursor-pointer border-b-1  border-white">
                  Contact
                </li>
              </>
            )}
          </ul>
        )}

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <ul className="flex md:hidden flex-col absolute top-full left-0 w-full bg-black z-50 border-t border-white/10">
            {isLoggedIn ? (
              <>
                <li
                  className="w-full flex items-center justify-center text-white font-semibold px-6 py-3 hover:bg-white hover:text-black cursor-pointer"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/userProfile');
                  }}
                >
                  Profile
                </li>

                <li
                  className="w-full flex items-center justify-center text-white font-semibold px-6 py-3 hover:bg-white hover:text-black cursor-pointer"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/userHealthProfile');
                  }}
                >
                  Health Profile
                </li>
                 {/* <li
                  className="w-full flex items-center justify-center text-white font-semibold px-6 py-3 hover:bg-white hover:text-black cursor-pointer"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/personalizedRecommnedation');
                  }}
                >
                  Personalized Recommendatio
                </li> */}

                <li
                  className="w-full flex items-center justify-center text-white font-semibold px-6 py-3 hover:bg-white hover:text-black cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link to="/cart" className="w-full flex justify-center">
                    Cart
                  </Link>
                </li>

                <li
                  className="w-full flex items-center justify-center text-white font-semibold px-6 py-3 hover:bg-white hover:text-black cursor-pointer"
                  onClick={() => {
                    setIsLoggedIn(false);
                    setIsMobileMenuOpen(false);
                    handleAuth();
                  }}
                >
                  Logout
                </li>
              </>
            ) : (
              <>
                <li
                  className="w-full flex items-center justify-center text-white font-semibold px-6 py-3 hover:bg-white hover:text-black cursor-pointer"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/');
                  }}
                >
                  Home
                </li>

                <li
                  className="w-full flex items-center justify-center text-white font-semibold px-6 py-3 hover:bg-white hover:text-black cursor-pointer"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/contact');
                  }}
                >
                  Contact
                </li>
              </>
            )}
          </ul>
        )}
      </div>
    </>
  );
};

export default Navbar;
