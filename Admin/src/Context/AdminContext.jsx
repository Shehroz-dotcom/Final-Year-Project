import { createContext, useState } from "react";
import axios from "axios";
import Urls from "../Utils/Url.js";

export const AdminContext = createContext({});

const AdminContextProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);

  //register
  const Register = async (credentials) => {
    try {
      const response = await axios.post(
        `${Urls.dev}/api/v1/admin/register`,
        credentials,
        { withCredentials: true },
      );

      if (response.data.success) {
        const admin = response.data.admin;
        setAdminData(admin);
        sessionStorage.setItem("admin", JSON.stringify(admin));
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        throw error; // 🔥 re-throw so UI can catch it
      } else {
        throw new Error("Network error");
      }
    }
  };

  const contextValue = { Register };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
