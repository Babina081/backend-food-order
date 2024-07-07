const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

//package to encrypt password
const bcrypt = require("bcryptjs");

//package to generate token
const jwt = require("jsonwebtoken");

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

//create user (SIGNU_UP)
router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    //encrypting password
    passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
    confirmPasswordHash: bcrypt.hashSync(req.body.confirmPasswordHash, 10),
    phone: req.body.phone,
    street: req.body.street,
    city: req.body.city,
    country: req.body.country,
  });

  user = await user.save();

  if (!user) {
    return res
      .status(400)
      .send({ success: false, message: "The user cannot be created!" });
  }
  res
    .status(200)
    .send({ success: true, message: "The user is created successfully", user });
});

//get all users
router.get("/", async (req, res) => {
  const userList = await User.find();
  if (!userList) {
    return res
      .status(500)
      .json({ success: false, message: "The user list cannot be retrieved" });
  }
  res.status(200).send({ success: true, userList });
});

//get user by id
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-passwordHash")
    .select("-confirmPasswordHash");
  if (!user) {
    return res.status(500).json({ success: false, message: "No user found" });
  }
  res.status(200).send({ success: true, user });
});

//update user
router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res
      .status(400)
      .send({ success: false, message: "the image file cannot be found" });
  }
  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      street: req.body.street,
      city: req.body.city,
      country: req.body.country,
      image: `${basePath}${fileName}`,
    },
    {
      new: true,
    }
  );
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "the user cannot be created!" });
  }
  res
    .status(200)
    .send({ success: true, message: "the user is updated successfully", user });
});

// delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  User.findByIdAndDelete(id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "The user is deleted successfully" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "The user is not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

// get user count
router.get("/get/count", async (req, res) => {
  const userCount = await User.countDocuments();
  if (!userCount) {
    return res
      .status(500)
      .json({ success: false, message: "Cannot get total user counts" });
  }
  res.status(200).send({ success: true, count: userCount });
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res
      .status(500)
      .json({ success: false, message: "The User cannot be found" });
  }
  //checking whether the password of the user entered and the password in the server matches or not
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    //creating token
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "1d" }
    );
    res.status(200).send({
      success: true,
      user: user.email,
      token: token,
      message: "User is authenticated",
    });
  } else {
    res
      .status(500)
      .json({ success: false, message: "The password is incorrect" });
  }
});

module.exports = router;
