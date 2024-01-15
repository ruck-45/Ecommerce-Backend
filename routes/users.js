// Dependencies
const express = require("express");
const passport = require("passport");

// Local Files
const { createUser, loginUser, getProfile, updateProfile } = require("../controllers/usersController");
const { updateRegisterCounter } = require("../middlewares/usersMiddlewares");

const router = express.Router();

// middleware
router.use("/profile", passport.authenticate("jwt", { session: false }));
router.use("/profile/images", express.static("./public/userImages"));

// routes
router.route("/signup").post(updateRegisterCounter, createUser);
router.route("/login").post(loginUser);
router.route("/profile").get(getProfile).put(updateProfile);

module.exports = router;
