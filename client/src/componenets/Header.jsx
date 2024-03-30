import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom'
import {FaSearch} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const [search,setSearch]= useState('');

  const {currentuser} = useSelector(state=>state.user)
  const navigat = useNavigate();
  const handleSubmit=(e)=>{
    e.preventDefault();
     const urlParams = new URLSearchParams(window.location.search);    
     urlParams.set('searchTerm', search);
     const searchurl = urlParams.toString();
      navigat(`/search?${searchurl}`)
    
  }

  useEffect(()=>{
   const urlparam =new URLSearchParams(location.search)
   const searchFromurl= urlparam.get('searchTerm')
   if(searchFromurl){
      setSearch(searchFromurl)
   }

  }, [location.search])
  return (
    <header className=" bg-purple-200 shadow-md">
      <div className=" flex justify-between p-3 items-center max-w-6xl mx-auto  " >
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap ">
          <span className="text-slate-500 ">Sheikh</span>
          <span className="text-slate-700">Estate</span>
        </h1>
        <form onSubmit={handleSubmit} className=" bg-purple-100 p-2 rounded-lg flex items-center  " >
          <input value={search} onChange={(e)=> setSearch(e.target.value)}  type="text" placeholder="Search....." className=" bg-transparent text-sm w-24 sm:w-64 focus:outline-none" />
          <button  >
            <FaSearch  className=" text-purple-800 " />
          </button>
        </form>
        <ul  className=" flex text-xs gap-4 ">
        <Link to="/">
          <li className=" hidden text-purple-900 sm:inline hover:underline " >Home</li>
        </Link>
        <Link to="/about" >
          <li className="hidden text-purple-900 sm:inline hover:underline " >About</li>
        </Link>
        <Link to="/profile" >
          {currentuser?  (
            <img className=" h-7 object-cover rounded-full " src={currentuser.avatar} alt="profile" />
          ):(
            <li className=" text-purple-900 sm:inline hover:underline"  >Sign in</li>
          )
        }
          
        </Link>
        </ul>
      </div>
    </header>
  )
};  

export default Header;
