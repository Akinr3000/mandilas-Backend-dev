const DB = require("../model");
const JWT = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { ErrorResponse, showError } = require("../utils");

const getUserId = asyncHandler(
  asyncHandler(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(400).json(showError("provide Token please", 400));
    }

    try {
      const decoded = JWT.verify(token, process.env.KEY, (err, user) => {
        if (err) throw new ErrorResponse("Invalid Token", 401);
        // if (user) console.log(user.id);
        req.user = user; // set user as property of req object
      });
      // console.log("still good");

      // let userdoc = await DB.User.findById(req.user.id);
      // console.log(req.user.id);

      next();
    } catch (error) {
      const message = error.message || "Internal Server error";
      const cs = error.statusCode || 500;
      res.status(cs).json(showError(message, cs));
    }
  })
);

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "login to access resource",
    });
  }

  try {
    const decoded = JWT.verify(token, process.env.KEY, (err, user) => {
      if (err) throw new ErrorResponse("Invalid Token", 401);
    });

    let user = await DB.User.findById(decoded);
    // console.log(user);
    req.user = user;
    next();
  } catch (error) {
    const message = error.message || "Internal Server error";
    const cs = error.statusCode || 500;
    res.status(cs).json(showError(message, cs));
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.isAdmin === false) {
    return res.status(500).json({
      success: false,
      message: "you have to be an admin to access this resource",
    });
  }
  next();
});

// rewrite this
const isSeller = asyncHandler(async (req, res, next) => {
  if (req.user.role === "buyer") {
    return res.status(500).json({
      success: false,
      message: "you have to be a seller to access this resource",
    });
  }

  next();
});

module.exports = { isAuthenticated, isAdmin, isSeller, getUserId };
