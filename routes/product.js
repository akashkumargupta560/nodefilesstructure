const express = require("express");
const { createProduct, getProduct, getAllProduct, updateProducts } = require("../controller/productCtrls");
const router =express.Router();

//Api create here
router.post("/", createProduct);
router.put("/:id", updateProducts);
router.get("/:id", getProduct);
router.get("/", getAllProduct)

module.exports = router;