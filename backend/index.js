const express = require("express");
const fileUpload = require("express-fileupload");
const cors= require('cors');
const app = express();

app.use(cors());


require("dotenv").config();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true, 
    tempFileDir: "/tmp/", 
  })
);

const db = require("./config/database");
db.connect();

const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

const socialMedia = require("./routes/CreateUser");
app.use("/socialMedia", socialMedia);

app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
