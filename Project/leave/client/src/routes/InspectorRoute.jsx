import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { currentInspector, currentSuperior } from '../function/auth';
import HeaderBar from '../components/layout/HeaderBar';
import Notfound404 from '../components/pages/Notfound404';
import ResponsiveAppBar from '../components/layout/ResponsiveAppBar';
import InspectorResponsiveAppBar from '../components/layout/InspectorResponsiveAppBar';


const InspectorRoute = ({ children }) => {
    const {user} = useSelector((state)=>({...state}))
    const [isToken, setIsToken] = useState(false);

    useEffect(()=>{
        if (user && user.user.token) {
            currentInspector(user.user.token)
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

    console.log("inspectorroute role :", user.user.role);
    console.log("inspectorroute token :", user.user.token);
  
    const text = "No Permission!!!"
  

  return isToken ? (
    <>
    <InspectorResponsiveAppBar />
      {children}
    </>
    
  ):<Notfound404 text={text}/>
}


export default InspectorRoute