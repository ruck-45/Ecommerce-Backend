const express = require("express");

const { getItems, getItemById } = require("../controllers/itemsController")

const router = express.Router();





router.route("/getItems").get(getItems);

router.route("/:itemId").get(getItemById);


module.exports = router;