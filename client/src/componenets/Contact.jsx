import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const Contact = ({listing}) => {
    
  const [userData, setUserdata] = useState({});
const [message, setmessage] = useState('')
const handlechange = (e) => {
    setmessage(e.target.value)
}
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(`/api/user/${listing.userRef}`);
        setUserdata(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [listing]);
  return (
    <div>
      {userData && (
        <div>
          <p>
            contact <span className=" font-semibold  " >{userData.username}</span> for{" "}
            <span className=" font-semibold  "  >{listing.name.toLowerCase()}</span>{" "}
          </p>
          <textarea className="w-full resize-none border border-slate-600 mt-2 rounded-lg p-1 " onChange={handlechange} value={message}  name="" id="" cols="30" rows="3"></textarea>
          <Link to={`mailto:${userData.email}?subject=regarding${listing.name}&bodt=${message}`} >
          <button className="p-2 mt-2 w-full bg-purple-900 text-white rounded-lg ">Send Message</button>
          
          </Link>
        </div>
      )}
    </div>
  );
};

export default Contact;
