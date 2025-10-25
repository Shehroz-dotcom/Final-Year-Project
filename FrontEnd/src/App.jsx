import { memo } from 'react';
import Navbar from './Components/Navbar.jsx';
import Footer from './Components/Footer';
import { Routes, Route } from 'react-router-dom';
import bg from './assets/paul-lichtblau-13khUlRITD8-unsplash.jpg';
import Home from './Pages/Home.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import Cart from './Pages/Cart.jsx';
import UserContextProvider from './Context/UserContext/UserContext.jsx';
import { ToastContainer } from 'react-toastify';
import FoodContextProvider from './Context/FoodContext/FoodContext.jsx';
import CartContextProvider from './Context/CartContext/CartContext.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import AuthProvider from './Context/AuthContext/AuthContext.jsx';
import Contact from './Pages/Contact.jsx';
import FoodDetails from './Pages/FoodDetails.jsx';
import Forget_Password from './Pages/Forget_Password.jsx';
import Reset_Password from './Pages/Reset_Password.jsx';
const App = () => {
  return (
    <div>
      <AuthProvider>
        <FoodContextProvider>
          <CartContextProvider>
            <UserContextProvider>
              {/* Navbar */}
              <Navbar />
              <main
                className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed border-none px-8 lg:px-20 py-15"
                style={{ backgroundImage: `url(${bg})` }}
              >
                <ToastContainer />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/food/:id" element={<FoodDetails />} />
                  <Route
                    path="/forget_Password"
                    element={<Forget_Password />}
                  />

                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reset_Password/:token"
                    element={<Reset_Password />}
                  />
                  <Route path="/forgetPassword" element={<Forget_Password />} />
                </Routes>
              </main>
              {/* footer */}
              <Footer />
            </UserContextProvider>
          </CartContextProvider>
        </FoodContextProvider>
      </AuthProvider>
    </div>
  );
};

export default memo(App);
