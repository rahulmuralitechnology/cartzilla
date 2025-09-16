import React, { ComponentType } from "react";
import { Navigate } from "react-router-dom";
import authService from "../services/authService";

interface PropType<T extends object = {}> {
  component: ComponentType<T>;
  componentProps?: T;
}

const PrivateRoute = <T extends object = {}>({
  component: Component,
  componentProps,
}: PropType<T>) => {
  if (authService.isAuthenticated() && authService.isAdmin()) {
    return <Component {...(componentProps as T)} />;
  }
  return <Navigate to="/account/sign-in" />;
};

export default PrivateRoute;
