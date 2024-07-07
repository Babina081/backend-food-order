const express = require("express");
const router = express.Router();
const Menu = require("../models/menu");
//for multiple images
const multer = require("multer");
const mongoose = require("mongoose");
const { Categories } = require("../models/category");

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

//get all menus
router.get("/", async (req, res) => {
  // filter menu item
  let filter = {};
  if (req.query.category) {
    filter = {
      category: req.query.category.split(","),
    };
  }

  const menuList = await Menu.find(filter).populate("category");
  if (!menuList) {
    return res.status(500).json({
      success: false,
      message: "The menu list cannot be retrieved",
    });
  }
  res.status(200).send({ success: true, menuList });
});

//get menu by id
router.get("/:id", async (req, res) => {
  const menu = await Menu.findById(req.params.id).populate("category");
  if (!menu) {
    return res
      .status(500)
      .json({ success: false, message: "Cannot find the menu" });
  }
  res.status(200).send({ succes: true, menu });
});

//create new menu
router.post("/", uploadOptions.single("image"), async (req, res) => {
  const category = await Categories.findById(req.body.category);
  if (!category) {
    return res
      .status(200)
      .json({ success: false, message: "The category cannot be found" });
  }

  const file = req.file;
  if (!file) {
    return res
      .status(400)
      .send({ success: false, message: "the image file cannot be found" });
  }
  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  console.log(`${basePath}${fileName}`);

  let menu = new Menu({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    menuInStock: req.body.menuInStock,
    image: `${basePath}${fileName}`,
    isFeatured: req.body.isFeatured,
    isFavorite: req.body.isFavorite,
    category: req.body.category,
  });

  menu = await menu.save();

  if (!menu) {
    return res
      .status(500)
      .json({ success: false, message: "The menu cannot be created" });
  }
  res.status(200).send({ success: true, menu });
});

//get featured menus
router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const menuFetaured = await Menu.find({
    isFeatured: true,
  }).limit(+count);
  if (!menuFetaured) {
    return res.status(500).json({
      success: false,
      message: "Cannot find featured menu",
    });
  }
  res.status(200).send({ success: true, menuFetaured });
});

//get menu count
router.get("/get/count", async (req, res) => {
  const menuCount = await Menu.countDocuments();
  if (!menuCount) {
    return res.status(500).json({
      success: false,
      message: "The menu count cannot be retrieved",
    });
  }
  res.status(200).send({ success: true, menuCount });
});

//delete menu
router.delete("/:id", (req, res) => {
  Menu.findByIdAndDelete(req.params.id)
    .then((menu) => {
      if (menu) {
        return res.status(200).send({
          success: true,
          message: "The menu has been deleted successfully",
        });
      } else {
        res
          .status(400)
          .send({ success: false, message: "Cannot find the menu" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

//update menu
router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid menu id" });
  }

  const category = await Categories.findById(req.body.category);
  if (!category) {
    return res
      .status(400)
      .send({ success: false, message: "The category cannot be found" });
  }

  const file = req.file;
  if (!file) {
    return res
      .status(400)
      .send({ success: false, message: "the image file cannot be found" });
  }
  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  console.log(`${basePath}${fileName}`);
  const menu = await Menu.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      menuInStock: req.body.menuInStock,
      image: `${basePath}${fileName}`,
      isFeatured: req.body.isFeatured,
      isFavorite: req.body.isFavorite,
      category: req.body.category,
    },
    { new: true }
  );
  if (!menu) {
    return res
      .status(400)
      .send({ success: false, message: "The menu cannot be updated" });
  }
  res.status(200).send({
    success: true,
    message: "The menu has been updated",
    menu,
  });
});

module.exports = router;
