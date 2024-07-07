const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv/config.js");

const app = express();

//middlewares
app.use(morgan("tiny"));
app.use(bodyParser.json());

//allow passing all the http in any other origin
app.use(cors());
app.options("*", cors());

app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

const port = process.env.PORT;
const api = process.env.API_URL;

//imported routes
const restaurantRoutes = require("./routes/restaurants");
const menuRoutes = require("./routes/menus");
const categoriesRoutes = require("./routes/categories");

//creating routes to make http request
app.use(`${api}/restaurants`, restaurantRoutes);
app.use(`${api}/menus`, menuRoutes);
app.use(`${api}/categories`, categoriesRoutes);

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
