const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    website:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    cart:{
        type:Array,
        default: []
    },
    address:[{type: mongoose.Schema.Types.ObjectId, ref:"Address"}],
    wishlist:[{type: mongoose.Schema.Types.ObjectId, ref:"Product"}]
},{
    timestamps:true
});
//for encrypt password
userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password,salt);
})
//for password match
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
//Export the model
module.exports = mongoose.model('userinfos', userSchema);




