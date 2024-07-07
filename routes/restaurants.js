const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant");
//for multiple images
const multer = require("multer");
const mongoose = require("mongoose");

//MIME TYPES
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

/*----------- image upload storage starts ----------*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});
const uploadOptions = multer({ storage: storage });
/*---------image upload storage ends------------*/

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
router.post("/", uploadOptions.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res
      .status(400)
      .send({ success: false, message: "the image file cannot be found" });
  }
  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  console.log(`${basePath}${fileName}`);

  let restaurant = new Restaurant({
    name: req.body.name,
    description: req.body.description,
    address: req.body.address,
    rating: req.body.rating,
    reviewNum: req.body.reviewNum,
    locationUrl: req.body.locationUrl,
    orderLimit: req.body.orderLimit,
    image: `${basePath}${fileName}`,
    isAvailable: req.body.isAvailable,
    isFeatured: req.body.isFeatured,
    isFavorite: req.body.isFavorite,
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
router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res
      .status(400)
      .send({ success: false, message: "the image file cannot be found" });
  }
  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  console.log(`${basePath}${fileName}`);
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      address: req.body.address,
      rating: req.body.rating,
      reviewNum: req.body.reviewNum,
      locationUrl: req.body.locationUrl,
      orderLimit: req.body.orderLimit,
      image: `${basePath}${fileName}`,
      isAvailable: req.body.isAvailable,
      isFeatured: req.body.isFeatured,
      isFavorite: req.body.isFavorite,
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

//muktiple image uploads
router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid restaurant Id");
    }
    const files = req.files;
    let imagesPaths = [];

    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (files) {
      files.forEach((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { images: imagesPaths },
      {
        new: true,
      }
    );
    if (!restaurant) {
      return res.status(400).send("The restaurant cannot be updated");
    }
    res.status(200).send({
      success: true,
      message: "The restaurant has been updated",
      restaurant,
    });
  }
);

module.exports = router;
