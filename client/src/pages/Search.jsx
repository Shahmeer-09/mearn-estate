import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListItem from '../componenets/ListItem';
import axios from 'axios';

const Search = () => {
  const [sidebar,setsidebar]= useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  })
  const [listingsm, setListings] = useState([]);
  const [showmore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log(listingsm);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebar.searchTerm);
    urlParams.set('type', sidebar.type);
    urlParams.set('parking', sidebar.parking);
    urlParams.set('furnished', sidebar.furnished);
    urlParams.set('offer', sidebar.offer);
    urlParams.set('sort', sidebar.sort);
    urlParams.set('order', sidebar.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setsidebar({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
 
      try {
        
        setLoading(true);
        setShowMore(false);
     
        const searchQuery = urlParams.toString();
         const res = await axios.get(`/api/listing/get?${searchQuery}`);
          console.log(res.data);
          const dataL = res.data;
        if (dataL.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setListings(dataL);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
      
    };
    fetchListings();
  },[location.search])

const handlechange  = (e)=>{
    if( e.target.id === 'all' || e.target.id === "Rent"|| e.target.id==="sale" ){
        setsidebar({...sidebar, type: e.target.id })
    } 
     if(e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer" ){
        setsidebar({...sidebar, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false, })
    }
    if(e.target.id === "searchTerm" ){
       setsidebar({...sidebar, searchTerm: e.target.value })
    }
    
    if(e.target.id === "sort_order" ){
      const sort = e.target.value.split("_")[0]
      const order = e.target.value.split("_")[1]

      setsidebar({...sidebar, sort, order })
    }
}
const handleShowmore = async() =>{
 const listingsL = listingsm.length
 const startIndex = listingsL;
 const urlParams = new URLSearchParams(location.search);
 urlParams.set('startIndex', startIndex);
 const searchQuery = urlParams.toString();
 const res = await axios.get(`/api/listing/get?${searchQuery}`);
 const dataS = res.data;
 if (dataS.length < 9) {
  setShowMore(false);
}
setListings([...listingsm, ...dataS]);
    
}

  return (
    <div className='  flex flex-col sm:flex-row '>
       <div className=' p-6 border-b-2   sm:border-r-2  sm:min-h-screen   ' >
        <form onSubmit={handleSubmit} className=' flex flex-col ' >
            <div  className=" flex gap-2 items-center  ">
                <label className=' font-semibold whitespace-nowrap ' >Search Term:</label>
                <input onChange={handlechange} value={setsidebar.searchTerm} type="text" className=' outline-none w-full p-2 ' id='searchTerm' placeholder='search...' />
            </div>

            <div className=' flex gap-2 mt-7 flex-wrap ' >
                <label className=' font-semibold' >Type:</label>
                <div className=' flex gap-2 '  >
                    <input onChange={handlechange} checked={sidebar.type==="all"} className=' w-4 ' type="checkbox" id='all' />
                    <span>Rent&sale</span>
                </div>
                <div className=' flex gap-2 '  >
                    <input onChange={handlechange} checked={sidebar.type==="Rent"}  className=' w-4 ' type="checkbox" id='Rent' />
                    <span>Rent</span>
                </div>
                <div className=' flex gap-2 '  >
                    <input onChange={handlechange} checked={sidebar.type==="sale"}  className=' w-4 ' type="checkbox" id='sale' />
                    <span>Sale</span>
                </div>
                <div className=' flex gap-2 '  >
                    <input onChange={handlechange} checked={sidebar.offer}  className=' w-4 ' type="checkbox" id='offer' />
                    <span>Offer</span>
                </div>
            </div>
            <div className=' flex gap-2 mt-7 flex-wrap ' >
                <label className=' font-semibold ' >Ameneties:</label>
                <div className=' flex gap-2 '  >
                    <input onChange={handlechange} checked={sidebar.parking}  className=' w-4 ' type="checkbox" id='parking' />
                    <span>Parking</span>
                </div>
                <div className=' flex gap-2 '  >
                    <input onChange={handlechange} checked={sidebar.furnished}  className=' w-4 ' type="checkbox" id='furnished' />
                    <span>Furnsihed</span>
                </div>
              
                
            </div>
            <div className='  gap-2 flex items-center mt-7' >
                <label  className=' font-semibold ' >Sort:</label>
                <select onChange={handlechange} defaultValue={'createdat_asc'}  className=' outline-none p-2' id="sort_order">
                  <option value='regularPrice_desc' >price higher to low</option>
                  <option value='regularPrice_asc'  >price low to high</option>
                  <option value='createdAt_desc'  >Desc</option>
                  <option value='createdAt_asc'  >Asce</option>
                </select>
            </div>
            <button className=' w-full text-white p-2 bg-purple-700 rounded-lg mt-3 hover:opacity-80 transition-all ' >Search</button>
        </form>
       </div>
       <div className=' flex-1  '> 
         <h1 className='text-3xl p-3 font-semibold' >Listing Result</h1>

          <div  className='p-7  flex flex-wrap gap-4  ' >
            {
              loading === false &&   listingsm.length === 0 && 
                <p className=' text-red-700 p-3  ' >No listings found.. </p>
              
            }
            {
             loading  &&
                <p className=' text-slate-700 p-3 w-full text-center  ' >loading...</p>
              
            }
             {
              !loading && listingsm && listingsm.map((listing)=>(
                 <ListItem listing={listing} key={listing._id} />
              ))
             }

             {
              showmore && ( 
               <button onClick={handleShowmore} className=' font-semibold  w-full hover:underline text-purple-900' >
                   Show more
               </button>
             )}
          </div>
        </div>
    </div>
  )
}

export default Search