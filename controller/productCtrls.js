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
// const getAllProduct = asyncHandler( async(req,resp) =>{
//     try{
//         ///Filtering
//         const querObj = { ...req.query };
//         const excludeFields = ["page","sort","limit","fields"];
//          excludeFields.forEach((el) => delete querObj[el]);
//         //  console.log(querObj); 

//         let queryStr = JSON.stringify(querObj);
//         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//         const query = await productModel.find(JSON.parse(queryStr));
//         // console.log(req.query,'....... QUery')
//         //Sorting
       
//         if(req.query){

//             var result = query.filter(function(e, i) {
//                 // console.log(query[i]==2000,'...........   QQQQQQ')
//                 return query[i] == req.query
//               })
//             //   console.log(result,'.............   RESULT')

//             // const sortBy = req.query.sort.split(",").join(" ");
//             // query =query.sort(sortBy);
//         }else{
//             query = query.sort("-createdAt")
//         }
//         const products = await query;
       
//         return resp.json(products)
//     }catch(error){
//         console.log(error,"errrorrrrr")
//         throw new Error(error);
//     }
// });
const getAllProduct = asyncHandler( async(req,res) =>{
    try {

        const query = {};
        
        if (req.query.price) {
            query.price = req.query.price;
        }
        if (req.query.color) {
            query.color = req.query.color;
        }
        if (req.query.category) {
            query.category = req.query.category;
        }
        console.log(query,'.............  query')
    
        const products = await productModel.find(query);

        console.log(products,".........................  products")
        // res.json(products);
      } catch (err) {
        console.log(err,'................. ERROR HERE')
        res.status(500).json({ message: err.message });
      }
});

module.exports = {createProduct,getProduct,getAllProduct,updateProducts};

// console.log(JSON.parse(queryStr)); 
        // const allProduct = await productModel.find(querObj);
        //Anthor way to filter
        // const allProduct = await productModel.where("category").equals(
        //     req.query.category
        // );