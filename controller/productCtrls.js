const productModel = require("../models/product");
const asyncHandler = require("express-async-handler");

//Create Api
const createProduct = asyncHandler( async( req, resp) =>{
    try{
        const newProduct = await productModel.create(req.body);
        resp.json(newProduct);
    }catch(error){
        throw new Error(error);
    }
});

//get API (singel data get by id)
const getProduct = asyncHandler( async(req, resp) =>{
    const {id} =req.params;
    console.log(id)
    try{
        const findProduct = await productModel.findById(id);
        resp.json(findProduct);
    }catch(error){
        throw new Error(error)
    }
});

//Get All Product API 
const getAllProduct = asyncHandler( async(req,resp) =>{
    try{
        const allProduct = await productModel.find();
        resp.json(allProduct)
    }catch(error){
        throw new Error(error);
    }
})
module.exports = {createProduct,getProduct,getAllProduct};