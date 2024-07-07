const mongoose = require("mongoose");

const menuSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  menuInStock: { type: Number, default: 0 },
  image: { type: String, default: "" },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
  },
  isFeatured: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
});

menuSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

menuSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Menu", menuSchema);
