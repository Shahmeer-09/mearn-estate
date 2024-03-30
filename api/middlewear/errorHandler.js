const errorChecker = (err, req, res , next) => {
   
    const statuscode = err.statusCode|| 520;
    console.log(err.message);
    const message = err.message || "internal server error";
      
    return  res.status(statuscode).json({
        success : false,
        message: message,
        statuscode: statuscode
})
 
}

module.exports = {errorChecker}