const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ status: "New success message" });
});

module.exports = router;
