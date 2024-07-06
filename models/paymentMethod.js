const mongoose = require("mongoose");

const paymentMethodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
