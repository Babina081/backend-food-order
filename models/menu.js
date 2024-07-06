const mongoose = require("mongoose");

const menuSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  menuInStock: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
});

menuSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  menuSchema.set("toJSON", {
    virtuals: true,
  });

module.exports=mongoose.model("Menu",menuSchema)
