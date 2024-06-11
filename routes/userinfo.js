const express = require("express");
const router = express.Router();
const {createUser,loginUserCtrl, getAllUsers}=require("../controller/usersinfo")


router.post("/register",createUser);
router.post("/login",loginUserCtrl);
router.get("/user-all",getAllUsers);
module.exports=router
