const express = require("express");
const router = express.Router();
const { getUserId } = require("../middlewares/auth");
const { mainMenuData } = require("../Controllers/mainMenuData");

router.get("/", getUserId, mainMenuData);

module.exports = router;
