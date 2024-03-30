import React from "react";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";

const ListItem = ({ listing }) => {
  return (
    <div  className=" bg-white   w-full sm:w-[255px]  rounded-lg overflow-hidden transiton-shadow duration-300 cursor-pointer  shadow-md    hover:shadow-xl ">
        <Link>
        <img
          src={listing.imageUrls[0]}
          alt="listing cover"
          className=" hover:scale-105 transition-scale duration-300  object-cover, overflow-hidden  h-[280px] sm:h-[180px]  w-full "
        />
        <div className=" box-border overflow-hidden w-full   p-2 flex flex-col gap-2 ">
          <h1 className=" font-semibold truncate   capitalize ">
            {listing.name}
          </h1>
          <div className=" flex items-center gap-2 ">
            <FaLocationDot className=" text-purple-800 " />
            <p className="  font-semibold text-gray-600 text-sm truncate sm:truncate ">
              {listing.address}
            </p>
          </div>
          <p className=" text-xs text-gray-600 line-clamp-2 ">
            {listing.description}
          </p>
          <p className=" text-sm" >
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "Rent" ? " / Month" : ""}
          </p>
          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs'>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <div className='font-bold text-xs'>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
          </div>
        </div>
    </Link>
      </div>
  );
};

export default ListItem;
