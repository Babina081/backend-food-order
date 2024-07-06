const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  address: {
    type: String,
    required: true,
  },
  country: { type: String, required: true },
  city: { type: String, default: "" },
  orderType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderType",
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Pending",
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  orderSchema.set("toJSON", {
    virtuals: true,
  });
  
  module.exports = mongoose.model("Order", orderSchema);
