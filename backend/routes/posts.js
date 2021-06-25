//Constants

const express = require("express");
const PostController = require('../controllers/posts');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/multer');
const router = express.Router();

// Using the Express router .post() function to send a POST request
// Create a new post
router.post(
    "",
    checkAuth, // Authenticates user
    extractFile, // Verify mimetype of file and add it to storage
    PostController.createPost); // Execute createPost() function from Posts.js controller

// Using the Express router .put() function to send a PUT HTTP request
// Update existing post
router.put(
    "/:id",
    checkAuth, // Authenticates user
    extractFile, // Verify mimetype of file and add it to storage
    PostController.updatePost); // Execute updatePost() function from Posts.js controller

// Using the Express router .get() function to send a GET HTTP request
// Fetchs a collection of posts
router.get(
    "",
    PostController.getPosts); // Execute getPosts() function from Posts.js controller

// Using the Express router .put() function to send a PUT HTTP request
// Fetch a single post
router.get(
    "/:id",
    PostController.getPost); // Execute getPost() function from Posts.js controller

// Using the Express router .delete() function to send a DELETE HTTP request
// Delete a post
router.delete(
    "/:id",
    checkAuth, // Authenticate user
    PostController.deletePost); // Execute .deletePost() function from Posts.js controller

module.exports = router;
