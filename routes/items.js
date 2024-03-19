const express = require("express");
const { getItems, getItemById } = require("../controllers/itemsController");

const router = express.Router();

// middleware
router.use("/itemImages", express.static("./public/itemImages"));

// routes
router.route("/getItems").get(getItems);
router.route("/:itemId").get(getItemById);

module.exports = router;
