import { createContext } from "react";
import axios from "axios";
import React from "react";
import Urls from "../../../FrontEnd/src/utils/Urls.js";

export const CloudContext = createContext({});

const CloudContextProvider = ({ children }) => {
  const Register = async (credentials) => {
    try {
      const response = await axios.post(
        `${Urls.dev}/api/v1/cloud/register`,
        credentials,
        { withCredentials: true },
      );

      return response.data; // optional
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
      } else if (error.request) {
        console.error("No response from server:", error.request);
      } else {
        console.error("Axios error:", error.message);
      }
      throw error;
    }
  };

  const Login = async (credentials) => {
    try {
      const response = await axios.post(
        `${Urls.dev}/api/v1/cloud/login`,
        credentials,
        { withCredentials: true },
      );
      console.log("data sent to backend:", credentials);
      console.log("backend response:", response.data);
      return response.data; // optional
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
      } else if (error.request) {
        console.error("No response from server:", error.request);
      } else {
        console.error("Axios error:", error.message);
      }
      throw error;
    }
  };

  const Logout = async () => {
    try {
      await axios.post(
        `${Urls.dev}/api/v1/cloud/logout`,
        {}, // empty body
        { withCredentials: true }, // <-- config goes here
      );
      window.location.href = "/";
    } catch (error) {
      console.log("Cloud logout error:", error.response?.data || error.message);
    }
  };

  const FetchOrders = async () => {
    try {
      const res = await axios.get(`${Urls.dev}/api/v1/cloud/getOrders`, {
        withCredentials: true,
      });
      return res.data.orders; // return orders
    } catch (error) {
      console.error("Failed to fetch orders:", error.response?.data || error);
      return [];
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.patch(
        `${Urls.dev}/api/v1/cloud/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true },
      );

      return res.data; // { success: true }
    } catch (error) {
      console.error("Status update failed:", error.response?.data || error);
      throw error;
    }
  };

  const contextValue = { Register, Login, FetchOrders, handleStatusChange , Logout };

  return (
    <CloudContext.Provider value={contextValue}>
      {children}
    </CloudContext.Provider>
  );
};

export default CloudContextProvider;
