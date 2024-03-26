// Dependencies
const express = require("express");

//Local Files
const { emailSent } = require("../controllers/emailFormController");

const router = express.Router();

router.route("/form").post(emailSent);

module.exports = router;
