// Dependencies
const express = require("express");
const path = require("path");
const multer = require("multer");
const passport = require("passport");

// Local Files
const {
  createUser,
  loginUser,
  getProfile,
  updateProfile,
  updateProfileImage,
  forgotPassword,
  resetPassword,
  getCart,
  getOrders,
  addToCart,
  removeFromCart,
} = require("../controllers/usersController");
const { updateRegisterCounter } = require("../middlewares/usersMiddlewares");

const router = express.Router();

// multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "userImages")); // Folder where Images Are saved
  },
  filename: (req, file, cb) => {
    const imageId = req.header("imageId");
    cb(null, `${imageId}.jpg`); // file Name
  },
});
const storeProfilePic = multer({ storage });

// middleware
router.use("/profile", passport.authenticate("jwt", { session: false }));
router.use("/profileImages", express.static("./public/userImages"));

// routes
router.route("/signup").post(updateRegisterCounter, createUser);
router.route("/login").post(loginUser);
router.route("/profile").get(getProfile).put(updateProfile);
router.route("/profile/images").put(storeProfilePic.single("image"), updateProfileImage);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").put(passport.authenticate("jwt", { session: false }), resetPassword);

// ****************************  Cart Routes  ************************************************************

router.route("/cart").get(passport.authenticate("jwt", { session: false }), getCart);
router
  .route("/cart/:itemId")
  .put(passport.authenticate("jwt", { session: false }), addToCart)
  .delete(passport.authenticate("jwt", { session: false }), removeFromCart);
router.route("/orders").get(passport.authenticate("jwt", { session: false }), getOrders);

module.exports = router;
