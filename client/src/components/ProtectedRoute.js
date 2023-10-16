import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = (props) => {
  const userLogin = useSelector((state) => state.userLogin);
  let location = useLocation();

  if (userLogin.userInfo !== null && "isAdmin" in userLogin.userInfo) {
    if (
      userLogin.userInfo.isAdmin ||
      userLogin.userInfo.isAdmin === props.isAdmin
    ) {
      return props.children;
    } else {
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }
  }
  return <Navigate to="/auth" state={{ from: location }} replace />;
};

export default ProtectedRoute;