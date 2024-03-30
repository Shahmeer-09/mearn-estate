
import React from 'react';
import { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux';
import { signStart, signinSuccess, signinFailure } from '../redux/user/userSlice';
import Oauth from "../componenets/Oauth";
const Signin = () => {
   const [formData, setformData] =useState({});
   const{error, loading, currentuser} = useSelector(state=> state.user)
   const naviaget = useNavigate();
   const dispatch = useDispatch();
   const handleChage = (e)=>
   {
     setformData({
      ...formData,
       [e.target.id]: e.target.value
     })
   }
  //  console.log(formData);
   const handleSubmit =async (e) => {
    e.preventDefault();
    
    dispatch(signStart())
    try{
       const data = await axios.post('/api/auth/signin',formData) 
        // naviaget('/')
        dispatch(signinSuccess(data.data))
        console.log(data.data);
      } catch(error){
        console.log(error);
        dispatch(signinFailure(error.response.data.message)) 
      }
        
      
     
   };
   console.log(currentuser);

  return (
    <div className=' max-w-lg font-aerial mx-auto '>
        <h1 className='text-center font-semibold text-3xl my-7'>Sign In</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-2 my-3 px-3'  >
          
          <input type="email" id='email' onChange={handleChage}  placeholder='email..' className='p-3 shadow-md border focus:outline-0 rounded ' /> 
          <input type="password" onChange={handleChage}  placeholder='password..' className='p-3 border focus:outline-0 shadow-md  rounded' id='password' /> 
          <button disabled={loading} type='submit' className='bg-purple-700 rounded p-3 text-white cursor-pointer text-lg'>
            {loading ? "loading..": " sign in"}
          </button>
          <Oauth/>
        </form>
        <div className='flex mx-3 gap-1'>
          <p>Dont have an account?</p>
          <Link to='/sign-up'>
            <span className='text-blue-700 cursor-pointer' >sign-up</span>
          </Link>
        </div>
        <div className=' max-w-lg px-3 '>
          <p className='text-red-700'>{error}</p>
        </div>
    </div>
  )
}

export default Signin
