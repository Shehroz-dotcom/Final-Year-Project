import { memo, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../../Context/AdminContext.jsx";

const ProtectedComponent = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AdminContext);
  console.log("admin is authenticated : " , isAuthenticated);
  
  console.log("admin auth check ", isAuthenticated);
  if (loading) return <p>Checing authentication</p>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default memo(ProtectedComponent);
