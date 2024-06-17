const userModel = require("../models/usersinfo");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler( async( req,resp,next) =>{
    let token;
    if(req?.headers?.authorization?.startsWith("Bearer")){
        token =req.headers.authorization.split(" ")[1];
        try{
            if(token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // console.log(decoded)
                const userDetails = await userModel.findById(decoded?.id);
                req.userDetails =userDetails;
                next();
            }
        }catch(error){
            throw new Error("NOt Authorized Token Expired, Please Login again")
        }
    }else{
        throw new Error("There is no token attached to header!");
    }
});

const isAdmin = asyncHandler( async(req,resp,next) =>{
    const {email} = req.userDetails;
    const adminUser = await userModel.findOne({email});
    // console.log(adminUser.role)
    if(adminUser.role !== "admin"){
        throw new Error("You are not an Admin!")
    }else{
        next();
    }
});

module.exports = {authMiddleware, isAdmin};