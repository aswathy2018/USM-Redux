import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const AdminProtect = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;
  return children;
};
