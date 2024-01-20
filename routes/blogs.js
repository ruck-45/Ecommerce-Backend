// Dependencies
const express = require("express");
// const passport = require("passport");

// Local Files
const { createBlog, getBlogById, getBlogs } = require("../controllers/blogsController");
const { updateRegisterCounter } = require("../middlewares/blogsMiddlewares");



const router = express.Router();

router.route("/blog").get(getBlogById);
router.route("/blogs").get(getBlogs);
router.route("/create-blog").post(updateRegisterCounter, createBlog);

module.exports = router;