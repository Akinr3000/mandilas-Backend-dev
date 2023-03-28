const express = require("express");
const router = express.Router();
const { addProduct, getpage, addtocart, getcart, removecart } = require("../Controllers/product");
const search = require("../Controllers/searchquery");

const sellers = require("../Controllers/seller-validation");

router.get("/prod", getpage);

router.post("/add", addProduct);

router.get("/getcart", getcart);

router.post("/addtocart", addtocart);

router.post("/removecart", removecart);

router.get("/:key", search.getquery);

router.get("/sells", sellers.get);

router.post("/submit", sellers.postseller);

module.exports = router;
