const User = require("../models/usersinfo"); // Assuming User is the Mongoose model
const asyncHandler =require("express-async-handler")
const createUser = asyncHandler(
    async (req, resp) => {
        // try {
            const email =req.body.email;
            const findUser =await User.findOne({email:email});
            if(!findUser){
                // Create a new users
                let newUser = await User.create(req.body);                              
                resp.send(newUser);
                resp.json(newUser);
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

const loginUserCtrl = asyncHandler(async (req,resp) =>{
    const {email, password} = req.body;
    console.log(email, password);

    //Check if user is exits or not 
    const findUser = await User.findOne({email});
    if(findUser && (await findUser.isPasswordMatched(password))){
        resp.json(findUser);
    }else{
        throw new Error("Invalid Credentials!")
    };
    
});

module.exports = { createUser, loginUserCtrl };
