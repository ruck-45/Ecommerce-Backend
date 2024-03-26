const express = require("express");
const multer = require("multer");
const path = require("path");
const passport = require("passport");
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  uploadItemImages,
} = require("../controllers/itemsController");

const { ensureEmployee, updateRegisterCounter } = require("../middlewares/itemsMiddleware");

const router = express.Router();

const itemStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "itemImages")); // Folder where Images Are saved
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename (Multer will handle unique filenames)
  }
});

const storeItemImage = multer({ storage: itemStorage });

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

router
  .route("/itemImages")
  .post(
    passport.authenticate("jwt", { session: false }),
    ensureEmployee,
    storeItemImage.array("images", 4),
    uploadItemImages
  );

  
module.exports = router;
