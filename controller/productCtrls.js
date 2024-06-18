const productModel = require("../models/product");
const asyncHandler = require("express-async-handler");

const createProduct = asyncHandler( async( req, resp) =>{
    try{
        const newProduct = await productModel.create(req.body);
        resp.json(newProduct);
    }catch(error){
        throw new Error(error);
    }
    
});
module.exports = {createProduct};