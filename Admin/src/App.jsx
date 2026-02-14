import { Route, Routes } from "react-router-dom";
import ProtectedComponent from "../src/Components/ProtectedComponent/ProtectedComponent.jsx";
import {
  AddFood,
  ListFood,
  AllKitchens,
  EditFood,
  GetOrders,
  Register,
  Login,
} from "./Pages/index.js";
import Layout from "./Components/Layout/Layout.jsx";

import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      {/* <Navbar /> */}
      <hr />
      <div className="">
        <Layout>
          <ToastContainer />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/add"
              element={
                <ProtectedComponent>
                  {" "}
                  <AddFood />
                </ProtectedComponent>
              }
            />
            <Route
              path="/list"
              element={
                <ProtectedComponent>
                  {" "}
                  <ListFood />
                </ProtectedComponent>
              }
            />
            <Route
              path="/edit"
              element={
                <ProtectedComponent>
                  <EditFood />
                </ProtectedComponent>
              }
            />
            <Route
              path="/kitchens"
              element={
                <ProtectedComponent>
                  {" "}
                  <AllKitchens />
                </ProtectedComponent>
              }
            />
            <Route
              path="/kitchens/:kitchenId"
              element={
                <ProtectedComponent>
                  {" "}
                  <GetOrders />
                </ProtectedComponent>
              }
            />
          </Routes>
        </Layout>{" "}
      </div>
    </>
  );
};

export default App;
//6:23:00
//Bocin@123@!DfEr@# db  password
