const mongoose = require("mongoose");
require("dotenv").config()

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(
        console.log("Db connected successfully")
    )
    .catch((error)=>{
        console.log("error in connecting to the database");
        console.log(error);
        process.exit(1);

    })



}