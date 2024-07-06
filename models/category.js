const mongoose = require("mongoose");

const categoriesSchema = mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("Categories", categoriesSchema);
