import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import "leaflet/dist/leaflet.css";
import CloudContextProvider from "./Context/CloudKitchenContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CloudContextProvider>
      <App />
    </CloudContextProvider>
  </BrowserRouter>
);
