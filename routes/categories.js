const express = require("express");
const router = express.Router();
const Category = require("../models/category");
//for multiple images
const multer = require("multer");
const mongoose = require("mongoose");

//MIME TYPES
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
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

//get all categories
router.get("/", async (req, res) => {
  const categoriesList = await Category.find();
  if (!categoriesList) {
    return res.status(500).json({
      success: false,
      message: "The categories list cannot be retrieved",
    });
  }
  res.status(200).send({ success: true, categoriesList });
});

//get category by id
router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res
      .status(500)
      .json({ success: false, message: "Cannot find the category" });
  }
  res.status(200).send({ succes: true, category });
});

//create new category
router.post("/", uploadOptions.single("image"), async (req, res) => {
  // const file = req.file;
  // if (!file) {
  //   return res
  //     .status(400)
  //     .send({ success: false, message: "the image file cannot be found" });
  // }
  // const fileName = req.file.filename;
  // const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    // image: `${basePath}${fileName}`,
  });

  category = await category.save();

  if (!category) {
    return res
      .status(500)
      .json({ success: false, message: "The category cannot be created" });
  }
  res.status(200).send({ success: true, category });
});

//get category count
router.get("/get/count", async (req, res) => {
  const categoryCount = await Category.countDocuments();
  if (!categoryCount) {
    return res.status(500).json({
      success: false,
      message: "The category count cannot be retrieved",
    });
  }
  res.status(200).send({ success: true, categoryCount });
});

//delete category
router.delete("/:id", (req, res) => {
  Category.findByIdAndDelete(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).send({
          success: true,
          message: "The category has been deleted successfully",
        });
      } else {
        res
          .status(400)
          .send({ success: false, message: "Cannot find the category" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

//update category
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
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      image: `${basePath}${fileName}`,
    },
    { new: true }
  );
  if (!category) {
    return res
      .status(400)
      .send({ success: false, message: "The category cannot be updated" });
  }
  res.status(200).send({
    success: true,
    message: "The category has been updated",
    category,
  });
});

module.exports = router;
