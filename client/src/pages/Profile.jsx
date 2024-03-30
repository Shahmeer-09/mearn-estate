// import axios from "axios";
import {Link} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useRef } from "react";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  updateUserFailure,
  updateuserStart,
  updateuserSuccess,
  deluserStart,
  deluserSuccess,
  deluserFailure,
  signOutuserFailure,
  signOutuserStart,
  signOutuserSuccess
} from "../redux/user/userSlice";
import axios from "axios";
const Profile = () => {
  const profileRef = useRef(null);
  const [file, setfile] = useState(undefined);
  const { currentuser, loading,error } = useSelector((state) => state.user);
  const [filepecentage, setfilepercentage] = useState(0);
  const [uploadError, setuploadError] = useState(null);
  const [formdata, setformdata] = useState({});
  const [ updateSuccess, setupdateSuccess]= useState(false);
  const [itemgetError,setITemGetError] = useState(false)
  const [items, setitems] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handlefileCahnge(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setformdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };

  const handlefileCahnge = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageref = ref(storage, filename);
    const uploadtask = uploadBytesResumable(storageref, file);

    uploadtask.on(
      "state-change",
      (snapshots) => {
        const progress =
          (snapshots.bytesTransferred / snapshots.totalBytes) * 100;
        setfilepercentage(Math.round(progress));
      },
      (error) => {
        setuploadError(error);
      },
      () => {
        getDownloadURL(uploadtask.snapshot.ref).then((download) => {
          setformdata({ ...formdata, avatar: download });
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateuserStart());
      const res = await fetch(`/api/user/update/${currentuser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      var data = await res.json();
      
      if (!data.success)  {
        dispatch(updateUserFailure(data.message));
        return;
      }
      
      
    } catch (error) {
      
      dispatch(updateUserFailure(error.message));
      
    }finally{
      dispatch(updateuserSuccess(data));
      setupdateSuccess(true);
    }
  };
  const handleDelete = async () => {
    
 
    try{
      
      dispatch(deluserStart());
       
     const data= await fetch(`/api/user/delete/${currentuser._id}`,{
      'method':"DELETE"
     });

     const res = await data.json();
     if(!res.success){
      dispatch(deluserFailure(res.message));
      return;
     }
     dispatch(deluserSuccess());
    }catch(error){
      
      dispatch(deluserFailure(error.message));
      
    }
  }
  const handleSignOut=async ()=>{
        try{
          dispatch(signOutuserStart());
          const res = await fetch('/api/auth/signout')
          const data = await res.json();
          if(!data.success){
            dispatch(signOutuserFailure(data.message));
            return;
          }
          
        }catch(err){
          dispatch(signOutuserFailure(err.message))
        }finally{
          dispatch(signOutuserSuccess());

        }
  }
  const getITem =async ()=>{
    
    try {
      setITemGetError(false)
      const data = await axios.get(`/api/user/listings/${currentuser._id}`)
      console.log(data.data);
      setitems(data.data)
      console.log(items);
    } catch (error) {
      setITemGetError(error.message)
    }
  }
  console.log(items);
 const handlelistDelete = async(itemid)=>{
  console.log(currentuser._id)
  try {
      await axios.delete(`/api/listing/delete/${itemid}`)
  } catch (error) {
    console.log(error.message);
  }finally{
    setitems(items.filter(item=>item._id!==itemid))
  }

 }
  return (
    <div className="p-6 max-w-lg mx-auto ">
      <h1 className=" font-aerial  font-semibold text-3xl text-center  ">
        Profile
      </h1>
      <form
        onSubmit={handleSubmit}
        action=""
        className="  flex justify-center flex-col gap-4 mt-4 "
      >
        <input
          onChange={(e) => setfile(e.target.files[0])}
          type="file"
          accept="image/*"
          hidden
          ref={profileRef}
        />
        <img
          onClick={() => profileRef.current.click()}
          className="  self-center rounded-full h-20 w-20 object-cover  cursor-pointer "
          src={formdata.avatar || currentuser.avatar}
          alt="profile image"
        />
        <p className=" text-sm self-center ">
          {uploadError ? (
            <span className=" text-red-600 ">
              Error Uploading {" image must be less than 2mb"}
            </span>
          ) : filepecentage > 0 && filepecentage < 100 ? (
            <span className=" text-slate-700 ">
              {" "}
              {`File uloading ${filepecentage}%`}{" "}
            </span>
          ) : filepecentage === 100 ? (
            <span className=" text-green-600 ">
              {" "}
              Image uloaded successfully{" "}
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          onChange={handleChange}
          defaultValue={currentuser.username}
          type="text"
          placeholder="username..."
          className="border shadow-lg p-3 rounded-lg  "
          id="username"
        />
        <input
          onChange={handleChange}
          defaultValue={currentuser.email}
          type="email"
          placeholder="Email..."
          className=" shadow-lg p-3 rounded-lg  "
          id="email"
        />
        <input
          onChange={handleChange}
          type="password"
          placeholder="password..."
          className=" shadow-lg p-3 rounded-lg  "
          id="password"
        />
        <button disabled={loading} className="  bg-green-600 text-white p-3 rounded-lg ">
          {loading ? "loading..." : "update"}
        </button>
        <Link className=" text-white bg-blue-700  p-3 rounded-lg text-center hover:opacity-95 "  to={"/create_listing"} >
          Create-Listing
        </Link>
      </form>
      <div className=" mt-2 flex justify-between ">
        <span onClick={handleDelete} className=" cursor-pointer text-red-600  ">Delete Account</span>
        <span onClick={handleSignOut} className=" cursor-pointer text-red-600   ">Sign out</span>
      </div>
        <p className='text-red-700 font-semibold '>{error? error: " "}</p>
        <p className='text-green-700 font-semibold '>{updateSuccess? "user is updated successfully": " "}</p>

       <button onClick={getITem}  className=" my-2 hover:text-green-500 w-full text-green-700  " >show Items</button>
       <p className=" text-red-700 text-sm my-2 " >
        {itemgetError ? itemgetError : " "}
       </p>

       {
        items && items.length > 0 &&(
          <div className="   p-3  " >
            <h1 className=" text-center font-semibold text-2xl mt-2 " >Your List</h1>
            {
              items.map(item=>(
                <div key={item._id} className="  border gap-4 my-2 flex justify-between items-center  " >
                  <Link to={'/listing'}>
                    <img className=" h-16 w-16 object-contain " src={item.imageUrls[0]} alt="" />
                  </Link>
                  <Link className=" box-content flex-1 hover:underline overflow-hidden  " >
                    <p className=" truncate ">{item.name}</p>
                  </Link>
                  <div className=" flex flex-col  ">
                    <button onClick={()=> handlelistDelete(item._id)} className=" text-sm text-red-700 " >DELETE</button>
                    <Link to={`/update_listing/${item._id}`}>
                    <button className=" text-sm text-green-700" >EDIT</button>
                    </Link>
                  </div>
              
                </div>
              ))
            }
          </div>
        )
       }
    </div>
  );
};
export default Profile;
