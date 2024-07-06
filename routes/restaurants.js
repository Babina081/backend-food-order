const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant");

//get all restaurants
router.get("/", async (req, res) => {
  const restaurantList = await Restaurant.find();
  if (!restaurantList) {
    return res.status(500).json({
      success: false,
      message: "The restaurant list cannot be retrieved",
    });
  }
  res.status(200).send({ success: true, restaurantList });
});

//get restaurant by id
router.get("/:id", async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return res
      .status(500)
      .json({ success: false, message: "Cannot find the restaurant" });
  }
  res.status(200).send({ succes: true, restaurant });
});

//create new restaurant
router.post("/", async (req, res) => {
  let restaurant = new Restaurant({
    name: req.body.name,
    address: req.body.address,
    rating: req.body.rating,
    reviewNum: req.body.reviewNum,
    locationUrl: req.body.locationUrl,
    orderLimit: req.body.orderLimit,
    image: req.body.image,
    available: req.body.available,
    isFeatured: req.body.isFeatured,
  });

  restaurant = await restaurant.save();

  if (!restaurant) {
    return res
      .status(500)
      .json({ success: false, message: "The restaurant cannot be created" });
  }
  res.status(200).send({ success: true, restaurant });
});

//update restaurant
router.put("/:id", async (req, res) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      address: req.body.address,
      rating: req.body.rating,
      reviewNum: req.body.reviewNum,
      locationUrl: req.body.locationUrl,
      orderLimit: req.body.orderLimit,
      image: req.body.image,
      available: req.body.available,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );
  if (!restaurant) {
    return res
      .status(400)
      .send({ success: false, message: "The restaurant cannot be updated" });
  }
  res.status(200).send({
    success: true,
    message: "The restaurant has been updated",
    restaurant,
  });
});

//delete restaurant
router.delete("/:id", (req, res) => {
  Restaurant.findByIdAndDelete(req.params.id)
    .then((restaurant) => {
      if (restaurant) {
        return res.status(200).send({
          success: true,
          message: "The restaurant has been deleted successfully",
        });
      } else {
        res
          .status(400)
          .send({ success: false, message: "Cannot find the restaurant" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

//get restaurant count
router.get("/get/count", async (req, res) => {
  const restaurantCount = await Restaurant.countDocuments();
  if (!restaurantCount) {
    return res.status(500).json({
      success: false,
      message: "The restaurant count cannot be retrieved",
    });
  }
  res.status(200).send({ success: true, restaurantCount });
});

//get featured restaurants
router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const restaurantFetaured = await Restaurant.find({
    isFeatured: true,
  }).limit(+count);
  if (!restaurantFetaured) {
    return res.status(500).json({
      success: false,
      message: "Cannot find featured restaurant",
    });
  }
  res.status(200).send({ success: true, restaurantFetaured });
});

module.exports = router;
