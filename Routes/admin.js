const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/admin");
const { isAdmin, isAuthenticated } = require("../middlewares/auth");

router.get("/seller", isAuthenticated, isAdmin, adminController.getadmin);

router.post(
  "/approve/:id",
  isAuthenticated,
  isAdmin,
  adminController.postadmin
);

module.exports = router;
