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
        credentials, {withCredentials: true}
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
        credentials, {withCredentials: true}
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

  const contextValue = { Register, Login };

  return (
    <CloudContext.Provider value={contextValue}>
      {children}
    </CloudContext.Provider>
  );
};

export default CloudContextProvider;
