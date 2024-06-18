const express = require("express");
const { createProduct, getProduct, getAllProduct } = require("../controller/productCtrls");
const router =express.Router();

//Api create here
router.post("/", createProduct);
router.get("/:id", getProduct);
router.get("/", getAllProduct)

module.exports = router;