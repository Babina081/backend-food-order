const mongoose = require("mongoose");

const orderTypeSchema = mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("OrderType", orderTypeSchema);
