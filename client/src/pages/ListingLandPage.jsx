import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Contact from "../componenets/Contact";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { FaShare, FaMapMarkerAlt, FaBed,FaBath, FaParking, FaChair } from "react-icons/fa";
import { useSelector } from "react-redux";
const ListingLandPage = () => {
  SwiperCore.use([Navigation]);
  const [listing, setlistItem] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const {currentuser} = useSelector((state) => state.user);
  const params = useParams();
  const [contact, setcontact] = useState(false);
  console.log(listing.userRef);
  console.log(currentuser);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const listingId = params.listingId;
        const response = await axios.get(`/api/listing/get/${listingId}`);
        // console.log(response.data);
        if (response.success === false) {
          setError(response.message);
          setloading(false);
        }
        setlistItem(response.data);
        setloading(false);
        setError(false);
      } catch (error) {
        setError(error.message);
        setloading(false);
      }
    };
    fetchData();
  }, [params.listingId]);
  // console.log(listItem);
  return (
    <main>
      {loading && (
        <p className="text-center font-semibold text-2xl my-2">Loading...</p>
      )}
      {error && (
        <p className="text-center font-semibold text-2xl my-2">{error}</p>
      )}
      {listing && listing.imageUrls && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((urls) => (
              <SwiperSlide key={urls}>
                <div
                  className=" h-[250px] sm:h-[320px] "
                  style={{
                    background: `url(${urls})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    transition: "all 0.5s ease-in-out",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-purple-400 cursor-pointer">
            <FaShare
              className="text-slate-100"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-purple-400 text-slate-50 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {  currentuser && currentuser._id !== listing.userRef && !contact &&
              <button onClick={()=> setcontact(true)} className="bg-purple-500 hover:opacity-70 transition-all  text-white px-4 py-2 rounded-md">Contact Seller</button>
            }
            {
              contact && <Contact listing={listing}/>
            }
          </div>

        </div>
      )}
    </main>
  );
};

export default ListingLandPage;
