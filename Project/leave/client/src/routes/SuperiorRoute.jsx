import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { currentSuperior } from '../function/auth';
import HeaderBar from '../components/layout/HeaderBar';
import Notfound404 from '../components/pages/Notfound404';
import ResponsiveAppBar from '../components/layout/ResponsiveAppBar';
import SuperiorResponsiveAppBar from '../components/layout/SuperiorResponsiveAppBar';

const SuperiorRoute = ({ children }) => {
    const {user} = useSelector((state)=>({...state}))
    const [isToken, setIsToken] = useState(false);

    useEffect(()=>{
        if (user && user.user.token) {
            currentSuperior(user.user.token)
            .then((r) => {
                // console.log(r);
                setIsToken(true)
              })
              .catch((err) => {
                console.log(err)
                setIsToken(false)
              });
        }
    },[user])

    console.log("superiorroute role :", user.user.role);
    console.log("superiorroute token :", user.user.token);
  
    const text = "No Permission!!!"
  

  return isToken ? (
    <>
    <SuperiorResponsiveAppBar />
      {children}
    </>
    
  ):<Notfound404 text={text}/>
}

export default SuperiorRoute