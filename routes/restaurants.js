const express = require("express");
const Restaurant = require("../models/restaurant");

const router = express.Router();

router.get("/", async (req, res) => {
  const restaurantList = await Restaurant.find();
  if (!restaurantList) {
    return res.status(500).json({ success: false });
  }
  res.status(200).send(restaurantList);
});

module.exports = router;
