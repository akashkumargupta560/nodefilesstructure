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
                console.log(decoded)
                const userDetails = await userModel.findById(decoded?.id);
                req.userDetails =userDetails;
                next();
            }
        }catch(error){
            throw new Error("NOt Authorized Token Expired, Please Login again")
        }
    }else{
        throw new Error("There is no token attached to headwe!");
    }
});

module.exports = {authMiddleware};