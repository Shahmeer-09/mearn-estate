import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import React, { useEffect } from "react";
import { app } from "../firebase";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";

const EditListItem = () => {
  const { currentuser } = useSelector((state) => state.user);
  console.log(currentuser);
  const [files, setfile] = useState([]);
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    userRef: currentuser._id,
});

  const [loading, setloading] = useState(false);
  const [listError, setlistingError] = useState(false);
  const [listLoading, setlistLoading] = useState(false);
  const params = useParams();
  const [imageuploadError, setimageuploadError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const itemId = params.itemId;
        const data  = await fetch(`/api/listing/get/${itemId} `)
        const result = await data.json();
        
        if(result.success === false){
            console.log(result.message);
            return
        }
         
        setformdata(result)
        
    };
    fetchData();
  }, []);


  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formdata.imageUrls.length < 7) {
      const fileArray = [];

      for (let i = 0; i < files.length; i++) {
        try {
          setloading(true);
          const url = await handleFirebaseUpload(files[i]);
          fileArray.push(url);
          setimageuploadError(false);
          setimageuploadError(false);
          setloading(false);
        } catch (err) {
          console.log(err);
          setimageuploadError("you can only upload image max 2mb");
          setloading(false);
          setloading(false);
        }
      }

      setformdata({
        ...formdata,
        imageUrls: formdata.imageUrls.concat(fileArray),
      });
    } else {
      setimageuploadError("you can only upload 6 images ");
      setloading(false);
    }
  };

  const handleFirebaseUpload = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageref = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageref, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (err) => {
          reject(err);
        },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveFromstate = (index) => {
    setformdata({
      ...formdata,
      imageUrls: formdata.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleformChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "Rent") {
      setformdata({
        ...formdata,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setformdata({
        ...formdata,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setformdata({
        ...formdata,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formdata.imageUrls.length < 1)
        return setlistingError("Upload atleast one image");
      if (formdata.regularPrice < formdata.discountPrice)
        return setlistingError("regular price must be greater than discount");
      setlistLoading(true);
      setlistingError(false);

      const data = await axios.post(
        `/api/listing/update/${params.itemId}`,
        formdata
      );
      setlistLoading(false);

      // console.log(formdata._id);
      // console.log(data.data);

      if (data.success === false) {
        setlistingError(res.message);
        setlistLoading(false);
        return;
      }
        navigate(`/listing/${formdata._id}`)
    } catch (err) {
      setlistLoading(false);
      setlistingError(err.message);
      console.log(err);
    }
  };
  return (
    <main className=" max-w-4xl  mx-auto p-10 ">
      <h1 className=" font-semibold text-2xl text-center my-7 ">
        Edit Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col  sm:flex-row  gap-6 "
      >
        <div className=" flex flex-col gap-4  flex-1">
          <input
            className="border p-2 border-gray-300 outline-none rounded-lg"
            type="text"
            placeholder="Name"
            id="name"
            minLength={5}
            maxLength={62}
            required
            value={formdata.name}
            onChange={handleformChange}
          />
          <textarea
            className="border p-2  border-gray-300 outline-none  rounded-lg"
            type="text"
            placeholder="description"
            id="description"
            required
            value={formdata.description}
            onChange={handleformChange}
          />
          <input
            className="border p-2  border-gray-300 outline-none  rounded-lg"
            type="text"
            placeholder="address"
            id="address"
            minLength={5}
            maxLength={62}
            required
            value={formdata.address}
            onChange={handleformChange}
          />

          <div className=" p-3 flex gap-7 flex-wrap">
            <div className=" flex gap-2">
              <input
                className="w-5 "
                type="checkbox"
                name="sale"
                id="sale"
                onChange={handleformChange}
                checked={formdata.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className=" flex gap-2">
              <input
                className="w-5 "
                type="checkbox"
                name="Rent"
                id="Rent"
                onChange={handleformChange}
                checked={formdata.type === "Rent"}
              />
              <span>Rent</span>
            </div>
            <div className=" flex gap-2">
              <input
                className="w-5 "
                type="checkbox"
                name="parkingSpot"
                id="parking"
                checked={formdata.parking}
                onChange={handleformChange}
              />
              <span>Parking</span>
            </div>
            <div className=" flex gap-2">
              <input
                className="w-5 "
                type="checkbox"
                name="Furnished"
                id="furnished"
                checked={formdata.furnished}
                onChange={handleformChange}
              />
              <span>Furnished</span>
            </div>
            <div className=" flex gap-2">
              <input
                className="w-5 "
                type="checkbox"
                name="offer"
                id="offer"
                checked={formdata.offer}
                onChange={handleformChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className=" flex flex-wrap gap-4 ">
            <div className=" flex gap-2 items-center ">
              <input
                className="border border-gray-600 p-1 rounded-lg"
                type="number"
                name=""
                id="bedrooms"
                min={1}
                max={10}
                required
                value={formdata.bedrooms}
                onChange={handleformChange}
              />
              <p>Beds</p>
            </div>
            <div className=" flex gap-2 items-center ">
              <input
                className="border border-gray-600 p-1 rounded-lg"
                type="number"
                name=""
                id="bathrooms"
                min={1}
                max={10}
                required
                value={formdata.bathrooms}
                onChange={handleformChange}
              />
              <p>Baths</p>
            </div>
            <div className=" flex gap-2 items-center ">
              <input
                className="border border-gray-600 p-1 rounded-lg"
                type="number"
                name=""
                id="regularPrice"
                min={50}
                max={100000}
                required
                value={formdata.regularPrice}
                onChange={handleformChange}
              />
              <div className=" flex flex-col items-center ">
                <p>Regular price</p>
                <span className=" text-xs font-semibold items-center ">
                  {" "}
                  ($ / month )
                </span>
              </div>
            </div>
            {formdata.offer && (
              <div className=" flex gap-2 items-center ">
                <input
                  className="border border-gray-600 p-1 rounded-lg"
                  type="number"
                  name=""
                  id="discountPrice"
                  min={0}
                  max={100000}
                  required
                  value={formdata.discountPrice}
                  onChange={handleformChange}
                />
                <div className=" flex flex-col items-center ">
                  <p>Discount price</p>
                  <span className=" text-xs font-semibold items-center ">
                    {" "}
                    ($ / month )
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="  flex flex-col gap-4 ">
          <p className=" font-semibold ">
            Image:
            <span className=" font-normal  text-gray-700 ">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className=" flex   gap-4">
            <input
              onChange={(e) => setfile(e.target.files)}
              className="border w-full border-gray-300 p-2"
              type="file"
              id="images"
              multiple
              accept="image/*"
            />
            <button
              onClick={handleUploadImage}
              type="submit"
              className=" p-2 text-green-700  border border-green-700 "
            >
              {loading ? "loading..." : "Upload"}
            </button>
          </div>
          <p className=" text-red-700 text-sm ">
            {imageuploadError && imageuploadError}
          </p>
          {formdata.imageUrls.length > 0 &&
            formdata.imageUrls.map((url, index) => (
              <div key={url} className=" flex justify-between p-3 border ">
                <img
                  src={url}
                  alt=""
                  className=" w-20 h-20 object-center object-contain "
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFromstate(index)}
                  className=" p-3 uppercase rounded-lg self-center   text-red-700 cursor-pointer text-sm hover:opacity-75  "
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={listLoading || loading}
            type="submit"
            className=" disabled:opacity-75 hover:opacity-75 bg-purple-800 text-white p-2 rounded-lg"
          >
            {listLoading === true ? "updating...." : "Edit List"}
          </button>

          <p className=" text-red-700 text-sm "> {listError && listError} </p>
        </div>
      </form>
    </main>
  );
};

export default EditListItem;
