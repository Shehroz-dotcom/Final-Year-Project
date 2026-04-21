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
import 'react-toastify/dist/ReactToastify.css'; // ✅ REQUIRED
import FoodContextProvider from './Context/FoodContext/FoodContext.jsx';
import CartContextProvider from './Context/CartContext/CartContext.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import AuthProvider from './Context/AuthContext/AuthContext.jsx';
import FoodDetails from './Pages/FoodDetails.jsx';
import Forget_Password from './Pages/Forget_Password.jsx';
import Reset_Password from './Pages/Reset_Password.jsx';
import { Chatbot } from './Components/Chatbot.jsx';
import UserProfilePage from './Pages/UserProfilePage.jsx';
import OrderStatus from './Pages/OrderStatus.jsx';
import About from './Pages/About.jsx';
import UserHealthProfile from './Pages/UserHealthProfile.jsx';
import Contact from './Pages/Contact.jsx';
import { Elements } from '@stripe/react-stripe-js';
import PersonalizedRecommendation from './Pages/PersonalizedRecommendation.jsx';
import { loadStripe } from '@stripe/stripe-js';

const App = () => {
  const stripePromise = loadStripe(
    'pk_test_51SmafhA6pSggXt8sIF7AOkSUqxRrxnSz1AcwsMpkf9JLFbZ67wla1HgA3cHrcEnVQEGAyGLbfqm5GULuXIibkkmk00ZWNYBfMp'
  );
  return (
    <AuthProvider>
      <FoodContextProvider>
        <CartContextProvider>
          <UserContextProvider>
            <Navbar />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
            <main
              className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed border-none px-8 lg:px-20 py-15"
              style={{ backgroundImage: `url(${bg})` }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/register" element={<Register />} />
                <Route path="/food/:id" element={<FoodDetails />} />
                <Route path="/forget_Password" element={<Forget_Password />} />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Elements stripe={stripePromise}>
                        {' '}
                        <Cart />
                      </Elements>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/userProfile"
                  element={
                    <ProtectedRoute>
                      <UserProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/userHealthProfile"
                  element={
                    <ProtectedRoute>
                      <UserHealthProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/personalizedRecommnedation"
                  element={
                    <ProtectedRoute>
                      <PersonalizedRecommendation />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orderStatus/:branchCode/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderStatus />
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
            <Footer />
            <div className="fixed bottom-6 right-6 z-50">
              <Chatbot />
            </div>
            {/* ✅ Toast container goes here */}
          </UserContextProvider>
        </CartContextProvider>
      </FoodContextProvider>
    </AuthProvider>
  );
};

export default memo(App);
