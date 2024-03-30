const bcryptjs = require('bcryptjs');
const Listing = require('../model/listing.models');
const User = require('../model/user.model');
const {errormanager}= require('../utils/errorUtil');

const updateuser= async (req,res,next)=>{
   console.log(req.user);
   if(req.user !== req.params.id ) return next(errormanager(401, "you can only update your own account"))

   try{

    if(req.body.password && typeof req.body.password === 'string') 
    {
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    const filter  = {_id:req.params.id};
    const  update= { 
        username: req.body.username,
        email : req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
    }
    const options = { new: true };
    const updateduser=await User.findByIdAndUpdate(filter, update, options).exec();

    res.status(200).json(updateduser);
   }catch(err){
    next(err)
 
   }
   }

   
 const deleteUser=async (req,res,next)=>{
        
    try{
           await  User.findByIdAndDelete(req.params.id).exec();

            res.clearCookie('refreshToken');
            res.status(200).json( "user is deleted");
    }catch(err){
        next(err)
    }
 }


 const getListings = async (req, res, next)=>{
     if(req.user === req.params.id)
     {
        try{
            const user = await Listing.find({userRef: req.params.id}).exec();
            res.status(200).json(user);
        }catch(err){
            next(err)
        }
     }else{
        return next(errormanager(401, "you can only see your own listings")) 
     
     }

 }
  const getLandlordData = async (req, res, next)=>{

    try {
        
        const user = await User.findById(req.params.id).exec();
        if(!user){
           return next(errormanager(404, "user not found"))
        }
        const { password:pass, ...rest} = user._doc
        res.status(200).json(rest);
    } catch (error) {
         next(error)
    }


  }
module.exports = {updateuser, deleteUser, getListings, getLandlordData};