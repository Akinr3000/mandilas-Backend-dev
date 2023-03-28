const express = require("express");
const router = express.Router();
const { createCategory, getCategories } = require("../Controllers/category");
const searchquery1 = require("../Controllers/searchquery"); 

router.post("/add", createCategory);
router.get("/get", getCategories);
router.get("/get/:key", searchquery1.getquery)

module.exports = router;
