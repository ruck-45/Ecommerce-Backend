// Dependencies
const express = require("express");
const multer = require("multer");
const path = require("path");
const passport = require("passport");

// Local Files
const { createBlog, getBlogById, getBlogs, updateBlogImage } = require("../controllers/blogsController");
const { updateBlogCounter, ensureEmployee } = require("../middlewares/blogsMiddlewares");

const router = express.Router();

// multer storage setup
const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "blogImages")); // Folder where Images Are saved
  },
  filename: (req, file, cb) => {
    const imageId = req.header("imageId");
    cb(null, `${imageId}.jpg`); // file Name
  },
});
const storeBlogImage = multer({ storage: blogStorage });

// middleware
router.use("/blogImages", express.static("./public/blogImages"));

// routes
router.route("/latest").get(getBlogs);
router.route("/:blogId").get(getBlogById);
router
  .route("/create")
  .post(passport.authenticate("jwt", { session: false }), ensureEmployee, updateBlogCounter, createBlog);
router
  .route("/blogImages")
  .post(
    passport.authenticate("jwt", { session: false }),
    ensureEmployee,
    storeBlogImage.single("image"),
    updateBlogImage
  );

module.exports = router;
