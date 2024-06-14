const { generateToken } = require("../config/jwtToken");
const UserModel = require("../models/usersinfo"); 
const asyncHandler =require("express-async-handler");
const validateMongoDbId = require("../utilits/validateMongodbId");

//user register 
const createUser = asyncHandler(
    async (req, resp) => {
        // try {
            const email =req.body.email;
            const findUser =await UserModel.findOne({email:email});
            if(!findUser){
                // Create a new users
                let newUser = await UserModel.create(req.body);                            
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
    const findUser = await UserModel.findOne({email});
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
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser
};
