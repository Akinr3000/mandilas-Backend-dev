const asyncHandler = require("express-async-handler");
const DB = require("../model");
const { ErrorResponse, random4Digits, showError } = require("../utils/");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/generateToken");
const nodemailer = require("nodemailer");
// const { showError,ErrorResponse,random4Digits } = require("@utils/");

const signUp = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;

  const checkValues =
    !firstName || !lastName || !email || !password || !phoneNumber;

  if (checkValues) {
    res.status(400).json({ message: "invalid request", success: false });
  }

  try {
    let matchingEmail = await DB.User.findOne({ email: email });

    if (matchingEmail) {
      throw new ErrorResponse("Email exists , please login ", 409);
    }

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    let newUser = await DB.User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    if (newUser) {
      let token = generateToken(newUser._id);

      res.status(201).cookie("token", token).json({
        success: true,
        token,
      });
    } else {
      throw new ErrorResponse("failed to Create User", 422);
    }
  } catch (error) {
    console.log(`error : ${error}`);
    const message = error.message || "Internal Server error";
    const cs = error.statusCode || 500;
    res.status(cs).json(showError(message, cs));
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "invalid request", success: false });
  }

  try {
    let user = await DB.User.findOne({ email });

    if (!user) {
      res.status(409);
      throw new ErrorResponse("invalid email", 409);
    }

    let matchingPassword = await bcrypt.compare(password, user.password);

    if (!matchingPassword) {
      throw new ErrorResponse(
        "invalid password please enter correct password",
        422
      );
    }
    let token = generateToken(user._id);

    res.status(200).cookie("token", token).json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(`error : ${error}`);
    const message = error.message || "Internal Server error";
    const cs = error.statusCode || 500;
    res.status(cs).json(showError(message, cs));
  }
});

const logOut = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "invalid request", success: false });
  }

  try {
    const user = await DB.User.findOne({ email });

    if (!user) {
      throw new ErrorResponse("User with this email does not exist", 409);
    }

    const resetToken = random4Digits();

    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; //1hr
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.gmail,
        pass: process.env.gmailPassword,
      },
    });

    const mailOptions = {
      from: process.env.gmail,
      to: email,
      subject: "Password reset request",
      html: `<p>
      Insert this security code in order to proceed with the password reset.
      </p>
      <p>
      ${resetToken}
      </p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);
      console.log(`Email sent to ${info.response}`);
    });

    return res.status(200).json({
      success: true,
      message: "Password reset Token has been sent to email address",
    });
  } catch (error) {
    const cs = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    return res.status(cs).json(showError(message, cs));
  }
});

const postResetToken = asyncHandler(async (req, res) => {
  const { resetToken } = req.body;

  if (!resetToken) {
    res.status(400).json({ message: "invalid request", success: false });
  }

  try {
    // find user with token
    const user = await DB.User.findOne({ resetToken });

    if (!user || Date.now() > user.resetTokenExpiration) {
      throw new ErrorResponse("Invalid or expired reset token", 401);
    }

    res.status(200).json({
      success: true,
      message: "Reset Token correct, proceed to reset password",
      email: user.email,
    });
  } catch (err) {
    const sc = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(sc).json(showError(message, sc));
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "invalid request", success: false });
  }

  try {
    // find user by reset token
    const user = await DB.User.findOne({ email: email });

    // validate
    if (!user) {
      throw new ErrorResponse("invalid request, email does not exist", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully, login please",
    });
  } catch (error) {
    const message = error.message || "Internal Server error";
    const cs = error.statusCode || 500;
    res.status(cs).json(showError(message, cs));
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "invalid request", success: false });
  }

  try {
    const user = await DB.User.findOne({ email });

    if (!user) {
      throw new ErrorResponse("User does not exist", 409);
    }

    await DB.User.deleteOne({ email });
    res.status(200).json({
      status: true,
      message: `user with ${email} has been deleted`,
    });
  } catch (error) {
    const cs = error.statusCode || 500;
    const message = error.message || "Internal server Error";
    res.status(cs).json(showError(message, cs));
  }
});

module.exports = {
  login,
  signUp,
  logOut,
  forgotPassword,
  postResetToken,
  resetPassword,
  deleteUser,
};
