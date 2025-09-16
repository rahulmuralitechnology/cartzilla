import React, { FC } from "react";
import { Navigate } from "react-router-dom";
import authService from "../services/authService";

interface PropType {
  component: React.FC;
  props?: any;
}

const ProtectedRoute: FC<PropType> = ({ component: Component, props }) => {
  if (authService.isAuthenticated()) return <Component {...props} />;
  return <Navigate to='/account/sign-in' />;
};

export default ProtectedRoute;
