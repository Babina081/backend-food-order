const mongoose = require("mongoose");

const restaurantServiceSchema = mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
});

module.exports = mongoose.model("RestaurantService", restaurantServiceSchema);
