import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Urls from "../Utils/Url.js";

export const AdminContext = createContext({});

const AdminContextProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Register
  const Register = async (credentials) => {
    const response = await axios.post(
      `${Urls.dev}/api/v1/admin/register`,
      credentials,
      { withCredentials: true },
    );

    if (response.data.success) {
      const admin = response.data.admin;
      setAdminData(admin);
      setIsAuthenticated(true);
      sessionStorage.setItem("admin", JSON.stringify(admin));
    }

    return response.data;
  };

  // Login
  const Login = async (credentials) => {
    const response = await axios.post(
      `${Urls.dev}/api/v1/admin/login`,
      credentials,
      { withCredentials: true },
    );

    if (response.data.success) {
      const admin = response.data.admin;
      setAdminData(admin);
      setIsAuthenticated(true);
      sessionStorage.setItem("admin", JSON.stringify(admin));
    }

    return response.data;
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${Urls.dev}/api/v1/admin/checkAuth`, {
        withCredentials: true,
      });

      if (response.data?.success && response.data?.authenticated) {
        setIsAuthenticated(true);
        setAdminData(response.data.data);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        adminData,
        isAuthenticated,
        loading,
        Register,
        Login,
        checkAuth,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
