const Admin = require("../model/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();



exports.login = async(req,res)=>{
    try {
       
        const{username,password}= req.body;

        
        if(!username||!password){
            return res.status(400).json({
                success:false,
                message:"please fill all detail carefully"
            });
        }
        
        let admin  = await Admin.findOne({username});

        
        if(!admin){
            return res.status(401).json({
                success:false,
                message:"admin is not registered",

            });
        }

        //payload creation
        const payload ={
            username:admin.username,
            id:admin.id,
            
        }


        
        if(await bcrypt.compare(password,admin.password)){
            
            let token =jwt.sign(payload,process.env.JWT_SECRET,
                {
                expiresIn:"2h",
            });
           

            

            admin=admin.toObject();
            admin.token=token;
            admin.password = undefined;
            
            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,

                 
            }  
            

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                admin,
                message:"user logged in successfully",
            })

         




        }
        else{
            
            return res.status(403).json({
                success:false,
                message:"password incorrect"
            })
        }
    } catch (error) {
        console.log(error,"error in login");
        return res.status(500).json({
            success:false,
            message:"Login failure",

        })
    }
}