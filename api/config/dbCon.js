const mongoose= require('mongoose');
const dbConnect= async ()=>{
    try{
        const result =   await  mongoose.connect(process.env.MONGO)
        if(result){
            console.log("Connected");
        }
    }catch(e){
        console.log("Failed to connect" + e);
    }
}

module.exports = dbConnect;