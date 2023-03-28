const express = require("express");
const router = express.Router();
const {
  login,
  signUp,
  logOut,
  forgotPassword,
  postResetToken,
  resetPassword,
  deleteUser,
} = require("../Controllers/auth");

// signUp Route
/**
 * @swagger
 * /api/signup:
 *  post:
 *    summary: Sign Up a user
 *    description: Register a new user with the given credentials
 *    tags: [Auth]
 *    requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                firstName:
 *                 type: string
 *                 description: First name of the user
 *                lastName:
 *                 type: string
 *                 description: Last name of the user
 *                email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *                password:
 *                 type: string
 *                 format: password
 *                 description: Password of the user
 *                phoneNumber:
 *                 type: string
 *                 description: Phone number of the user
 *    responses:
 *      201:
 *        description: User registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: A JWT access token for the signed-in user
 *                status:
 *                  type: Boolean
 *                  description: successful request
 *      400:
 *        description: Invalid request body
 *      409:
 *        description: Email address already exists
 *      422:
 *        description: Unprocessable Entity
 *      500:
 *        description: Internal server error
 *
 */
router.post("/signup", signUp);

// login Route
/**
 * @swagger
 * /api/login:
 *  post:
 *    summary: login a user
 *    description: signin a new user with the given credentials
 *    tags: [Auth]
 *    requestBody:
 *       description: User login
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *                password:
 *                 type: string
 *                 format: password
 *                 description: Password of the user
 *    responses:
 *      200:
 *        description: User login successfull
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: A JWT access token for the signed-in user
 *                status:
 *                  type: Boolean
 *                  description: successful request
 *      400:
 *        description: Invalid request body
 *      409:
 *        description: Invalid password
 *      500:
 *        description: Internal server error
 *
 */
router.post("/login", login);

// logout
/**
 * @swagger
 * /api/logout:
 *  get:
 *    summary: logout a user
 *    description: signout a user with the given credentials
 *    tags: [Auth]
 *    responses:
 *      200:
 *        description: User logout successfull
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: "Logged out"
 *                status:
 *                  type: Boolean
 *                  description: successful request
 *      400:
 *        description: Invalid request body
 *      500:
 *        description: Internal server error
 *
 */
router.get("/logout", logOut);

// delete User
/**
 * @swagger
 * /api/delete:
 *  post:
 *    summary: delete a user
 *    description: delete a user with the given credentials
 *    tags: [Auth]
 *    requestBody:
 *       description: delete User
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *    responses:
 *      200:
 *        description: User deleted successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: user with email deleted
 *                success:
 *                  type: Boolean
 *                  description: successful request
 *      400:
 *        description: Invalid request body
 *      409:
 *        description: User does not exist
 *      500:
 *        description: Internal server error
 *
 */
router.post("/delete", deleteUser);

// forget password route
/**
 * @swagger
 * /api/forgot-password:
 *  post:
 *    summary: forgot password endpoint
 *    description: send user email that needs change of password
 *    tags:
 *       - forgot Password
 *    requestBody:
 *       description: user email
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *    responses:
 *      200:
 *        description: User reset token sent successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Password reset Token has been sent to email address
 *                status:
 *                  type: Boolean
 *                  description: successful request
 *      400:
 *        description: Invalid request body
 *      409:
 *        description: User does not exist
 *      500:
 *        description: Internal server error
 *
 */
router.post("/forgot-password", forgotPassword);

// reset Token
/**
 * @swagger
 * /api/reset-token:
 *   post:
 *     summary: post token sent to user email
 *     description: post the 4 digits reset password token sent to user email address.
 *     tags:
 *       - forgot Password
 *     requestBody:
 *       description: token sent to email address of the user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetToken:
 *                 type: string
 *                 description: token sent to email address of the user
 *     responses:
 *       200:
 *         description: Reset password token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the reset password token was generated successfully
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the request
 *                 email:
 *                   type: string
 *                   description: The email address for which the reset password token was generated
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized, Invalid or expired reset token
 *       500:
 *         description: Internal server error
 */
router.post("/reset-token", postResetToken);

// reset Password
/**
 * @swagger
 * /api/reset-password:
 *  post:
 *    summary: reset password endpoint
 *    description: user email and new password
 *    tags:
 *       - forgot Password
 *    requestBody:
 *       description: user email and new password
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *                password:
 *                 type: string
 *                 description: new password
 *    responses:
 *      200:
 *        description: User reset token sent successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Password reset successfully, login please
 *                success:
 *                  type: Boolean
 *                  description: successful request
 *      400:
 *        description: Invalid request body
 *      409:
 *        description: User does not exist
 *      500:
 *        description: Internal server error
 *
 */
router.post("/reset-password", resetPassword);

module.exports = router;
