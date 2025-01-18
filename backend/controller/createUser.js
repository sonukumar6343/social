const path = require("path");
const user = require("../model/userModel");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const { authenticateToken } = require('../middleware/auth');


const fileUploadMiddleware = fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
});


function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}


async function uploadFileToCloudinary(file, folder, quality = "auto:low") {
  const options = {
    folder,
    resource_type: "auto",
    transformation: [{ quality: quality }],
  };
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}


exports.createUser = async (req, res) => {
  try {
    const { name, socialMediaHandle } = req.body;
    console.log(name, socialMediaHandle);

   
    if (
      !req.files ||
      !req.files.imageFile ||
      (Array.isArray(req.files.imageFile) && req.files.imageFile.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded. Please upload image files.",
      });
    }

   
    const imageUrls = [];

    
    const files = Array.isArray(req.files.imageFile)
      ? req.files.imageFile
      : [req.files.imageFile];

   
    for (const file of files) {
      
      if (!file.name) {
        return res.status(400).json({
          success: false,
          message: "Invalid file uploaded. Missing file name.",
        });
      }

     
      const supportedTypes = ["jpg", "jpeg", "png"];
      const fileType = path.extname(file.name).slice(1).toLowerCase(); 
      if (!isFileTypeSupported(fileType, supportedTypes)) {
        return res.status(400).json({
          success: false,
          message:
            "File format not supported. Only jpg, jpeg, and png are allowed.",
        });
      }

      
      const response = await uploadFileToCloudinary(file, "socialMedia");
      imageUrls.push(response.secure_url); 
    }

    
    const newUser = await user.create({
      name,
      socialMediaHandle,
      imageUrl: imageUrls,
    });

    res.status(201).json({
      success: true,
      message: "User has been created successfully",
      imageUrls: imageUrls,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Unable to create the user",
    });
  }
};


exports.getAllUser = [
  authenticateToken, 
  async (req, res) => {
    try {
      const allUser = await user.find({});
      return res.status(200).json({
        success: true,
        message: "All users have been fetched successfully",
        allUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message: "Unable to fetch all users",
        error: error.message,
      });
    }
  }
];

