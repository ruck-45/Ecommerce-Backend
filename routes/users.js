// Dependencies
const { Router } = require("express");

// Local Files
const { createUser } = require("../controllers/usersController");
const { updateRegisterCounter } = require("../middlewares/usersMiddlewares");

const router = Router();

// routes
router.route("/createUser").post(updateRegisterCounter, createUser);

module.exports = router;
