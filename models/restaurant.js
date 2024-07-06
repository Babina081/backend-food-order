const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviewNum: {
    type: Number,
    default: 0,
  },
  locationUrl: {
    type: String,
  },
  orderLimit: {
    type: Number,
    default: 0,
  },
  image: { type: String, default: "" },
  images: [
    {
      type: String,
    },
  ],
  available: {
    type: Boolean,
    default: true,
  },
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    // required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    // required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RestaurantService",
    // required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

restaurantSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

restaurantSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
exports.restaurantSchema = restaurantSchema;
