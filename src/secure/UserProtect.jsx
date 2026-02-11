import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const UserProtect = ({ children }) => {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


export const UserLoginProtect = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return children;
};
