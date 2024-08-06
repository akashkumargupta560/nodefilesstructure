const { generateToken } = require("../config/jwtToken");
const UserModel = require("../models/usersinfo"); 
const asyncHandler =require("express-async-handler");
const validateMongoDbId = require("../utilits/validateMongodbId");
const { generateRegreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
//user register 
// const createUser = asyncHandler(
//     async (req, resp) => {
//         // try {
//             const email =req.body.email;
//             const findUser =await UserModel.findOne({email:email});
//             if(!findUser){
//                 // Create a new users
//                 let newUser = await UserModel.create(req.body);                            
//                 resp.send(newUser);
//                 resp.json(findUser);
//             }else{
//                 throw new Error("User Already Exists!");                                                                                                                                 
//                 // resp.json({
//                 //     msg:"User Already Exists!",
//                 //     success:false
//                 // });
//             }
//         // } catch (error) {
//         //     console.error(error);
//         //     resp.status(500).send("Error creating user");
//         // }
//     }
// );
const createUser = async (req, resp) => {
        try {
            const email =req.body.email;
            const findUser = await UserModel.findOne({email:email});

            if(findUser){

            resp.json({
                msg:"User Already Exists!",
                success:false
            });
            }
            else{
                let newUser = await UserModel.create(req.body);                            
                resp.send(newUser);
            }
        } catch (error) {
            console.error(error);
            resp.status(500).send("Error creating user");
        }
    }

//user login Api
const loginUserCtrl = asyncHandler(async (req,resp) =>{
    const {email, password} = req.body;
    // console.log(email, password);

    //Check if user is exits or not 
    const findUser = await UserModel.findOne({email});
    if(findUser && (await findUser.isPasswordMatched(password))){
        const refreshToken = await generateRegreshToken(findUser?._id)
        const updateUser = await UserModel.findByIdAndUpdate(
            findUser.id,{
                refreshToken:refreshToken,
            },{
                new:true
            }
        );
        // resp.cookie(refreshToken,{
        //     httpOnly:true,
        //     maxAge: 72 * 60 * 60 * 1000,
        // })
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
        resp.status(404)
        throw new Error("Invalid Credentials!")
    };
});
//Hnadle REfresh Token
const handleRefreshToken = asyncHandler( async(req, resp) =>{
    const cookie = req.cookies;
    // console.log(cookie,"??????????????????????????????????")
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies!");
    const refreshToken = cookie.refreshToken;
    // console.log(refreshToken);
    const user = await UserModel.findOne({ refreshToken });
    if(!user) throw new Error("No Refresh token present in db or not match!");
    jwt.verify(refreshToken, process.env.JWT_SECRET,(err, decoded) =>{
        console.log(decoded)
        if(err || user.id !== decoded.id){
            throw new Error("This is something wrong with refresh token!");
        }
        const accessToken = generateToken(user?._id)
        resp.json(accessToken)
    });
});
//Logout create API
const logout = asyncHandler(async (req, resp) => {
    const cookie = req.cookies;
    
    if (!cookie?.refreshToken) {
        throw new Error("No Refresh Token in Cookies!");
    }

    const refreshToken = cookie.refreshToken;
    const user = await UserModel.findOne({ refreshToken });

    if (!user) {
        resp.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        });
        return resp.sendStatus(204); // No Content
    }

    // Clear refreshToken in the database for the user
    await UserModel.findOneAndUpdate({
        refreshToken: "",
    });

    // Clear the refreshToken cookie in the response
    resp.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });

    resp.sendStatus(204); // No Content
});

//Update use API
const updateUser =asyncHandler ( async (req,resp) =>{
    const {_id} = req.userDetails;
    validateMongoDbId(_id)
    try{
        const userUpdateValue = await UserModel.findByIdAndUpdate( _id,{
            name:req.body?.name,
            username:req.body?.username,
            email:req.body?.email,
            phone:req.body?.phone,
            website:req.body?.website,
        },{
            new:true,
        });
        resp.json(userUpdateValue);

    }catch(error){ 
        throw new Error(error);
    }
});

//Get all user data Api

const getAllUsers = asyncHandler( async(req,resp) =>{
    try{
        const getUsers = await UserModel.find()
        // console.log(getUsers)
        resp.send(getUsers)
    }catch(error){
        throw new Error(error,"Invalid Credentials Users!")
    }
});

//Get single User

const getSingleUser = asyncHandler( async(req,resp) =>{
    const {id} =req.params;
    // console.log(id)
    validateMongoDbId(id);
    try{
        const singleUser = await UserModel.findById(id);    
        resp.json(singleUser);
    }catch(error){
       throw new Error(error)
    }
});

///delete user single detail
const deleteUser = asyncHandler( async(req,resp) =>{
    const {id} = req.params;
    // console.log(id)
    validateMongoDbId(id);
    try{
        const deleteUsers = await UserModel.findByIdAndDelete(id);
        resp.json(deleteUsers);
    }catch(error){
        throw new Error(error);
    }
});

const blockUser = asyncHandler( async( req,resp) =>{
    const {id } = req.params;
    validateMongoDbId(id);
    try{
        const block = await UserModel.findByIdAndUpdate(
            id,
            {
                isBlock:true,
            },
            {
                new:true,
            }
        );
        resp.json({
            message:"User Blocked!",
        })
    }catch(error){
        throw new Error(error);
    }
});

const unblockUser = asyncHandler( async( req,resp) =>{
    const {id } = req.params;
    validateMongoDbId(id);
    try{
        const unblock = await UserModel.findByIdAndUpdate(
            id,
            {
                isBlock:false,
            },
            {
                new:true,
            }
        );
        resp.json({
            message:"User UnBlocked!",
        })
    }catch(error){
        throw new Error(error);
    }
});
module.exports = { 
    createUser, 
    loginUserCtrl,
    logout,
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken
};
