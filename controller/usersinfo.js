const User = require("../models/usersinfo"); // Assuming User is the Mongoose model
const asyncHandler =require("express-async-handler")
const createUser = asyncHandler(
    async (req, resp) => {
        // try {
            const email =req.body.email;
            const findUser =await User.findOne({email:email});
            if(!findUser){
                // Create a new users
                let newUser = await User.create(req.body); // Assuming req.body contains user data
                // console.log(newUser);                                
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

module.exports = { createUser };
