const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  quantity: { type: Number, required: true },
});
module.exports = mongoose.model("OrderItem", orderItemSchema);
