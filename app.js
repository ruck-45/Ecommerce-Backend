// Dependencies
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Local Files
const auth = require("./routes/auth");
const { testConnection, createAuthTable } = require("./utils/database");

const port = process.env.PORT;
const app = express();

// Essential Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", auth);

// Database Connection and Configuration
testConnection();
createAuthTable();

app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});
