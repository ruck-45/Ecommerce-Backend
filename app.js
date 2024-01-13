// Dependencies
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Local Files
const users = require("./routes/users");
const { testConnection, createAuthTable } = require("./utils/database");
const { genKeyPair } = require("./utils/generateKeypair");

const port = process.env.PORT;
const app = express();

// Essential Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/users", users);

// Database Connection and Configuration
testConnection();
createAuthTable();

// Generate Private and Public Key
genKeyPair();

app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});
