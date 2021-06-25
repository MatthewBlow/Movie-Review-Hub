// Constants

const express = require("express");
const router = express.Router();
const UserController = require('../controllers/user');

// Using the Express router .post() function to send a POST request
// Creates a new user
router.post(
  "/signup",
  UserController.createUser); // Execute .createUser() function from user.js controller

// Using the Express router .post() function to send a POST request
// Login user
router.post(
  "/login",
  UserController.userLogin); // Execute .userLogin() function from user.js controller

module.exports = router;
