import React from "react";
import HeaderBar from "../components/layout/HeaderBar";
import { useSelector } from "react-redux";
import ResponsiveAppBar from "../components/layout/ResponsiveAppBar";
import Notfound404 from "../components/pages/Notfound404";
import InspectorResponsiveAppBar from "../components/layout/InspectorResponsiveAppBar";
import SuperiorResponsiveAppBar from "../components/layout/SuperiorResponsiveAppBar";

const UserRoute = ({ children }) => {
  const { user } = useSelector((state) => ({ ...state }));
  console.log("UserRoute", user);

  const userRole = () => {
    switch (user.user.role) {
      case "user":
        return <ResponsiveAppBar />;
      case "inspector":
        return <InspectorResponsiveAppBar />;
      case "superior":
        return <SuperiorResponsiveAppBar />;
      default:
        return <ResponsiveAppBar />;
    }
  };

  return user && user.user.token ? (
    <>
      {userRole()}
      {children}
    </>
  ) : (
    <Notfound404 text="No login" />
  );
};

export default UserRoute;
