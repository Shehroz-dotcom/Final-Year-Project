import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Urls from '../../utils/Urls.js';

export const UserContext = createContext({});
//const sessionStorage = createSessionStorage();

const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${Urls.dev}/api/v1/auth/checkAuth`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setUserData(res.data.data); // the decoded user
        }
      } catch (error) {
        console.warn('User not authenticated:', error.response?.data?.message);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        `${Urls.dev}/api/v1/user/login`,
        credentials,
        { withCredentials: true }
      );
      //sesstion storage

      if (response.data.success) {
        setUserData(response.data.user);
        sessionStorage.setItem('User', JSON.stringify(response.data.user));
        console.log(
          JSON.parse(sessionStorage.getItem('User')),
          'from sesstion storage '
        );
        // ✅ store only data, not full response
      }

      return response.data; // return so caller can also use it
    } catch (error) {
      if (error.response) {
        console.error('Login request failed:', error);
      }

      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        `${Urls.dev}/api/v1/user/logout`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        // Clear user data
        setUserData(null);
        console.log('✅ User logged out');
        // Optional: redirect
        sessionStorage.removeItem('User');
        sessionStorage.removeItem("cart")
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error.response?.data || error.message);
    }
  };

  const Register = async (credentials) => {
    try {
      const response = await axios.post(
        `${Urls.dev}/api/v1/user/register`,
        credentials,
        { withCredentials: true }
      );
      if (response.data.success) {
        setUserData(response.data.user);
      }
      return response.data;
    } catch (error) {
      if (error.response) {
        // ✅ Status code from backend
        console.error('Status:', error.response.status);

        // ✅ Message you set in the controller
        console.error('Message:', error.response.data.message);

        // (Optional) Full response object
      } else {
        console.error('❌ Network or other error:', error.message);
      }
    }
  };

  const contextValue = { userData, setUserData, login, Register, logout };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
