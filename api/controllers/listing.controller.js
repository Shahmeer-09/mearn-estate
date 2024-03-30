const listing = require('../model/listing.models');
const {errormanager} = require('../utils/errorUtil');
const  createlisting =async (req, res, next) => {
    try{
          const data  =await listing.create(req.body);
          res.status(200).json(data)
    }catch(err){
      next(err);
    }
}

const deleteListing = async (req, res, next) => {
 
    const listitem =await listing.findById({_id:req.params.id}).exec();
     console.log(listitem.name);
    if(!listitem){ 
        return next(errormanager(404, "listing not found"))
    }
      console.log(listitem.userRef);
      console.log(req.user + 'hoo');
    if(req.user !== listitem.userRef ){
        return next(errormanager(401, "you can only delete your own listings"))
    
    }

    try{
      await listing.findByIdAndDelete(req.params.id);
      res.status(200).json("listing deleted successfully")
    }catch(err){
      next(err);
    }
}


const getSelected= async (req, res, next) => {
 

  try {
    const item= await listing.findOne({_id:req.params.id});
    if(!item){
      return next(errormanager(404, "listing not found"))
    }
    
    console.log(item);
    res.status(200).json(item)
  } catch (error) {
    next(error)
  }

}
const updateData =async (req, res, next)=>{
    const listitem =await listing.findById(req.params.id);
    if(!listitem){
        return next(errormanager(404, "listing not found"))
    }

    if(listitem.userRef !== req.user){
        return next(errormanager(401, "you can only update your own listings"))

    }

    try {
      await listing.findByIdAndUpdate(req.params.id, req.body, {new:true});
      res.status(200).json("listing updated successfully")
    } catch (error) {
      next(error)
    }
}

const searchListing =async (req, res, next) => {
  
  try {
      const limit  = parseInt(req.query.limit) || 9;
      const startIndex = parseInt(req.query.startIndex) || 0;
      let offer   = req.query.offer;
      if(offer === undefined || offer=== 'false'){
          offer = {$in: [false, true]}
      }

      let furnished = req.query.furnished;
      if(furnished === undefined || furnished === 'false'){
          furnished = {$in: [false, true]}
      }

        let parking = req.query.parking;
      if(parking === undefined || parking === 'false'){
          parking = {$in: [false, true]}
      }
       let type = req.query.type;
       if(type === undefined || type === 'all'){
           type = {$in: ['sale', 'Rent']}
       }

       let searchTerm = req.query.searchTerm || '';
       let sort = req.query.sort || 'createdAt';
       let order = req.query.order || 'desc';

        const listitemGot =   await listing.find({
        name : {$regex: searchTerm, $options: 'i'},
        offer,
        furnished,
        parking,
        type
       }).sort({[sort]: order}).limit(limit).skip(startIndex);

    res.status(200).json(listitemGot)

  } catch (error) {
    next(error)
  }


}


module.exports = {createlisting, searchListing, deleteListing,getSelected,  updateData}