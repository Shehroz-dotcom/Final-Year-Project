import { Route, Routes } from "react-router-dom";
import { AddFood, ListFood, AllKitchens, EditFood , DeliveredOrders} from "./Pages/index.js";
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
            <Route path="/add" element={<AddFood />} />
            <Route path="/list" element={<ListFood />} />
            <Route path="/edit" element={<EditFood />} />
            <Route path="/kitchens" element={<AllKitchens />} />
            <Route
              path="/kitchens/:id/delivered-orders"
              element={<DeliveredOrders />}
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
