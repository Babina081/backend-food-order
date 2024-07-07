const mongoose = require("mongoose");

const categoriesSchema = mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String },
  image: {
    type: String,
  },
});

exports.Categories = mongoose.model("Categories", categoriesSchema);
