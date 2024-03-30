import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  signinSuccess,
  signinFailure,
  signStart,
} from "../redux/user/userSlice";
import Oauth from "../componenets/Oauth";
const Signup = () => {
  const [formData, setformData] = useState({});
  const { error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const naviaget = useNavigate();
  const handleChage = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  //  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(signStart());
    try {
      const data = await axios.post("/api/auth/signup", formData);
      naviaget("/sign-in");
      dispatch(signinSuccess());
    } catch (error) {
      console.log(error);
      dispatch(signinFailure(error.response.data.message));
      // sethiserror(error.response.data.message);
    }
  };

  return (
    <div className=" max-w-lg font-aerial mx-auto ">
      <h1 className="text-center font-semibold text-3xl my-7">Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 my-3 px-3"
        id="name"
      >
        <input
          required
          type="text"
          onChange={handleChage}
          placeholder="Username.."
          className="p-3 border focus:outline-0 rouded"
          id="username"
        />
        <input
          required
          type="email"
          id="email"
          onChange={handleChage}
          placeholder="email.."
          className="p-3 border focus:outline-0 rounded "
        />
        <input
          required
          type="password"
          onChange={handleChage}
          placeholder="password.."
          className="p-3 border focus:outline-0  rounded"
          id="password"
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-purple-700 rounded p-3 text-white cursor-pointer text-lg"
        >
          {loading ? "loading.." : " sign up"}
        </button>
        <Oauth />
      </form>
      <div className="flex mx-3 gap-1">
        <p>Already have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700 cursor-pointer">sign-in</span>
        </Link>
      </div>
      <div className=" max-w-lg px-3 ">
        <p className="text-red-700">{error}</p>
      </div>
    </div>
  );
};

export default Signup;
