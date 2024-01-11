const express = require("express");
const cors = require("cors");

const auth = require("./routes/auth");

const port = process.env.PORT || 443;

const app = express();
app.use(cors());

// Routes
app.use("/api/auth", auth);

app.get("/", (req, res) => {
  res.status(200).json({ status: "Newly updated API call message" });
});

app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});
