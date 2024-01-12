const express = require("express");
require("dotenv").config();
const cors = require("cors");
const pool = require("./connect");

const auth = require("./routes/auth");

const port = process.env.PORT;

const app = express();
app.use(cors());

// Routes
app.use("/api/auth", auth);

const query = "SELECT * FROM dummy_users";
const dun = async () => {
  const result = await pool.query(query);
  console.log(result[0]);
};

app.get("/", async (req, res) => {
  dun();
  res.status(200).json({ status: "New API message" });
});

app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});
