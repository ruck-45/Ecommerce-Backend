const express = require("express");
const cors = require("cors");

const auth = require("./routes/auth");

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());

// Routes
app.use("/api/auth", auth);

app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});
