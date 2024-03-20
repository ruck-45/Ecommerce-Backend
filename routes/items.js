const express = require("express");
const multer = require("multer");
const path = require("path");
const passport = require("passport");
const { getItems, getItemById, createItem, updateItem, deleteItem } = require("../controllers/itemsController");

const { ensureEmployee, updateRegisterCounter } = require("../middlewares/itemsMiddleware");

const router = express.Router();


const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "blogImages")); // Folder where Images Are saved
  },
  filename: (req, file, cb) => {
    const imageId = req.header("imageId");
    cb(null, `${imageId}.jpg`); // file Name
  },
});
const storeItemImage = multer({ storage: blogStorage });


// middleware
router.use("/itemImages", express.static("./public/itemImages"));

// routes
router.route("/getItems").get(getItems);

router.route("/:itemId").get(getItemById);

router
  .route("/createItem")
  .post(passport.authenticate("jwt", { session: false }), ensureEmployee, updateRegisterCounter, createItem);

router
  .route("/updateItem")
  .put(passport.authenticate("jwt", { session: false }), ensureEmployee, updateRegisterCounter, updateItem);


router
  .route("/deleteItem")
  .delete(passport.authenticate("jwt", { session: false }), ensureEmployee, updateRegisterCounter, deleteItem);

module.exports = router;
