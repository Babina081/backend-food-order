const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
  quantity: { type: Number, required: true },
});
module.exports = mongoose.model("Cart", cartSchema);
