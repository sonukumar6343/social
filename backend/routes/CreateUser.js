const express = require("express");
const router = express.Router();

const { createUser,getAllUser } = require("../controller/createUser");
const{login}= require("../controller/Auth");
const {authenticateToken} = require("../middleware/auth");



router.post("/createUser", createUser);
router.get('/getAllUser', authenticateToken, getAllUser);


router.post("/login",login);

module.exports = router;
