const express = require("express");
const router = express.Router();
const {createUser}=require("../controller/usersinfo")


router.post("/create",createUser);

module.exports=router
