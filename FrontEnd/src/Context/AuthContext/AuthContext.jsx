import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Urls from '../../utils/Urls.js';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ define checkAuth here, not inside useEffect
  const checkAuth = async () => {
    try {
      const response = await axios.get(`${Urls.dev}/api/v1/auth/checkAuth`, {
        withCredentials: true,
      });

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check error:', error.response?.data || error.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth(); // ✅ now this works
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, loading, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
