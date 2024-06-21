const productModel = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify =require("slugify");
//Create Api
const createProduct = asyncHandler( async( req, resp) =>{
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await productModel.create(req.body);
        resp.json(newProduct);
    }catch(error){
        throw new Error(error);
    }
});
//Update Product API
// const updateProducts =asyncHandler( async( req, resp) =>{
//     const id =req.params.id;
//     console.log(id);
//     try{
//         if(req.body.title){
//             req.body.slug = slugify(req.body.title);
//         }
//         const updateProduct = await productModel.findOneAndUpdate(id,req.body, {
//             new:true
//         });
//         console.log(updateProduct)
//         resp.json(updateProduct);
//     }catch(error){
//         throw new Error(error);
//     }                                                                                                                                       
// })
const updateProducts = asyncHandler(async (req, res) => {
    const id = req.params.id; // Extract id from req.params

    try {
        let updateFields = req.body;
        
        if (updateFields.title) {
            updateFields.slug = slugify(updateFields.title);
        }

        const updatedProduct = await productModel.findByIdAndUpdate(id, updateFields, {
            new: true, // Return the updated document
            runValidators: true // To run validators (e.g., required fields) on update
        });

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (error) {
        // Use asyncHandler to handle errors
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
});

module.exports = {createProduct,getProduct,getAllProduct,updateProducts};