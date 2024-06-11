const { generateToken } = require("../config/jwtToken");
const User = require("../models/usersinfo"); 
const asyncHandler =require("express-async-handler")
//user register 
const createUser = asyncHandler(
    async (req, resp) => {
        // try {
            const email =req.body.email;
            const findUser =await User.findOne({email:email});
            if(!findUser){
                // Create a new users
                let newUser = await User.create(req.body);                            
                resp.send(newUser);
                resp.json(findUser);
            }else{
                throw new Error("User Already Exists!");                                                                                                                                 
                // resp.json({
                //     msg:"User Already Exists!",
                //     success:false
                // });
            }
        // } catch (error) {
        //     console.error(error);
        //     resp.status(500).send("Error creating user");
        // }
    }
);

//user login Api
const loginUserCtrl = asyncHandler(async (req,resp) =>{
    const {email, password} = req.body;
    // console.log(email, password);

    //Check if user is exits or not 
    const findUser = await User.findOne({email});
    if(findUser && (await findUser.isPasswordMatched(password))){
        resp.json({
            _id:findUser?._id,
            name:findUser?.name,
            username:findUser?.username,
            email:findUser?.email,
            phone:findUser?.phone,
            website:findUser?.website,
            token:generateToken(findUser?._id)
        });
    }else{
        throw new Error("Invalid Credentials!")
    };
});

//Get all user data Api

const getAllUsers = asyncHandler( async(req,resp) =>{
    try{
        const getUsers = await User.find()
        console.log(getUsers)
        resp.send(getUsers)
    }catch(error){
        throw new Error(error,"Invalid Credentials Users!")
    }
});

module.exports = { createUser, loginUserCtrl,getAllUsers };
