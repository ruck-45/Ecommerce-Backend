const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connection = require("./connect");

const auth = require("./routes/auth");

const port = 5000;

const app = express();
app.use(cors());

// Routes
app.use("/api/auth", auth);

const query = "SELECT * FROM hmsfvsom_users.users";

app.get("/", (req, res) => {
  connection.query(query, (err, results, fields) => {
    !err ? res.json(results) : res.json({ err });
  });
  // res.status(200).json({ status: "API message" });
});

app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});
