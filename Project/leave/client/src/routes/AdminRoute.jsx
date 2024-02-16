import React, { useEffect, useState } from "react";
import HeaderBar from "../components/layout/HeaderBar";
import { useSelector } from "react-redux";
import { currentAdmin } from "../function/auth";
import Notfound404 from "../components/pages/Notfound404";

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [isToken, setIsToken] = useState(false);

  useEffect(() => {
    if (user && user.user.token) {
      currentAdmin(user.user.token)
        .then((r) => {
          // console.log(r);
          setIsToken(true)
        })
        .catch((err) => {
          console.log(err)
          setIsToken(false)
        });
    }
  }, [user]);
  console.log("adminroute role :", user.user.role);
  console.log("adminroute token :", user.user.token);

  const text = "No Permission!!!"

  return isToken ? (
    <>
    <HeaderBar />
      {children}
    </>  
  ):<Notfound404 text={text}/>
};

export default AdminRoute;
