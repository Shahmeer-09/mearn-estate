const User = require('../model/user.model');
const bcryptjs = require('bcryptjs');
const {errormanager} = require('../utils/errorUtil');
const jwt = require("jsonwebtoken");

const  signup = async (req, res, next)=>{
    const {username, email, password} = req.body;

    const hashedpwd = await bcryptjs.hash( password, 10);

     
   try{
       const result = await User.create({
           username: username,
           email: email,
           password: hashedpwd
       })
       console.log(result);
       res.status(201).send('user is created successfully')
   }catch(err){ 
       next(err)
    // res.status(500).send('error creating user' + err);
   }
  
    
}

const signin = async (req, res,next)=>{
     
    const {email, password} = req.body;
    try{
        const validuser = await  User.findOne({email});
        if(!validuser) return next(errormanager(404, "user not found"))
        const validpwd  = bcryptjs.compareSync(password,  validuser.password);
        if(!validpwd) return next(errormanager(401, "invalid password"));

        // const accesstoken = jwt.sign(
        //  {
        //    "iserinfo": {
        //      "id": validuser._id,
        //      "username": validuser.username,
        //      "email": validuser.email
        //    } 
        //  }, 
        // process.env.ACCESS_TOKEN, 
        // { expiresIn: '15s'}
        // )
        const refreshToken = jwt.sign(
            {
                id: validuser._id,
            },
        process.env.REFRESH_TOKEN,
        {expiresIn: '1Day'}
        )
       
         const {password:pass, ...rest } = validuser._doc;
      
        const result = await  validuser.save();
        console.log(result);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }).status(200).json(rest)
        
    }catch(err){
        return next(err)
    }  
}

const google =async (req, res, next)=>{
   
    try{
    const validuser = await User.findOne({email:req.body.email});
    if(validuser){
        // const accesstoken = jwt.sign(
        //     {
        //         "iserinfo": {
        //             "id": validuser._id,
        //             "username": validuser.username,
        //             "email": validuser.email
        //           } 
        //     }, 
        //    process.env.ACCESS_TOKEN, 
           
        //    )
           const refreshToken = jwt.sign(
               {
                   id: validuser._id,
               },
           process.env.REFRESH_TOKEN,
           {expiresIn: '1Day'}
           )
            const {password:pass, ...rest } = validuser._doc;
        
           res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }).status(200).json(rest)
        }
        else{
              const pwd = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
              const hashpwd = bcryptjs.hashSync(pwd,10);
              const newuser = await User.create({
                    username: req.body.username,
                    email:req.body.email,
                    password:hashpwd,
                    avatar: req.body.photo,
              })
          
            //   const accesstoken = jwt.sign(
            //     {
                  
            //         id: newuser._id,
            //     } ,
            //    process.env.ACCESS_TOKEN, 
            //    { expiresIn: '200s'}
            //    )
               const refreshToken = jwt.sign(
                   {
                       id: newuser._id,
                   },
               process.env.REFRESH_TOKEN,
               {expiresIn: '1Day'}
               )
                const {password:pass, ...rest } = validuser._doc;
           
               res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }).status(200).json(rest)
            }
           

            }catch (err) {
               next(err);
            }
}

const signOut =async (req, res, next)=>{
   try{
       res.clearCookie('refreshToken');
       res.status(200).json( "user is signed out");
   }catch(err){
       next(err)
   }
}
module.exports = {signup,signin,google, signOut};