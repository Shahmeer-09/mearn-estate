import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'
const Private = () => {
    const {currentuser}= useSelector(state=>state.user)
 return   currentuser ?  <Outlet/> : <Navigate to="/sign-in"/>
   
  
}

export default Private