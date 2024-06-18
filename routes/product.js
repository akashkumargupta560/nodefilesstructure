const express = require("express");
const { createProduct } = require("../controller/productCtrls");
const router =express.Router();

//Api create here
router.post("/", createProduct);
// router.get("/", getProduct);

module.exports = router;