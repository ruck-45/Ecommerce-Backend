// Dependencies
const { Router } = require("express");

// Local Files
const { createUser, loginUser } = require("../controllers/usersController");
const { updateRegisterCounter } = require("../middlewares/usersMiddlewares");

const router = Router();

// routes
router.route("/signup").post(updateRegisterCounter, createUser);
router.route("/login").post(loginUser);

module.exports = router;
