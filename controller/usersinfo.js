const User = require("../models/usersinfo"); // Assuming User is the Mongoose model

const createUser = async (req, resp) => {
    try {
        // Create a new document using the create method of the User model
        let newUser = await User.create(req.body); // Assuming req.body contains user data
        console.log(newUser);
        resp.send(newUser);
    } catch (error) {
        console.error(error);
        resp.status(500).send("Error creating user");
    }
};

module.exports = { createUser };
