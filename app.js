const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config.js");

const app = express();
const port = 3000;
app.get("/", (req, res) => {
  res.send("Hello World");
});

//connection to mongodb
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    dbName: process.env.MONGODB_DATABASE,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

//connection to server (expressjs)
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
