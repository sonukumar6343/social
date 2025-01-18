const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{ 
        type:String,
        required:true,
        
    },
    socialMediaHandle:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:[String],
        required:true,
    }
});
module.exports = mongoose.model("user",userSchema);
 