// Dependencies
const { Router } = require("express");
const passport = require("passport");

// Local Files
const { createUser, loginUser, getProfile } = require("../controllers/usersController");
const { updateRegisterCounter } = require("../middlewares/usersMiddlewares");

const router = Router();

// middleware
router.use("/profile", passport.authenticate("jwt", { session: false }));

// routes
router.route("/signup").post(updateRegisterCounter, createUser);
router.route("/login").post(loginUser);
router.route("/profile").get(getProfile);

module.exports = router;
