const jwt =require( "jsonwebtoken")
const { errormanager } = require("../utils/errorUtil");
const verifyjwt = (req,res,next) => {
      
      const token =  req.cookies.refreshToken;
      
      if(!token) return next(errormanager(401,"You are not authenticated"));
    jwt.verify(
        token,
        process.env.REFRESH_TOKEN,
        (err,decoded) => {
            // console.log(decoded.id);
            if(err)return next(errormanager(403,"forbidden: token  verification is failed"));
            req.user = decoded.id;
            next();
        }
    )
}

module.exports =  verifyjwt