const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config.js");

const app = express();
const port = process.env.PORT;
const api = process.env.API_URL;

const restaurantRoutes = require("./routes/restaurants");

app.use(`${api}/restaurants`, restaurantRoutes);

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
