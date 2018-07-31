const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const multer = require("multer");

const upload = multer({ storage, fileFilter });
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, ".uploads/");
  },
  filename: function(req, file, callback) {
    callback(null, newDate().toISOString() + path.extname(file.originalname));
  }
});
const fileFilter = function(req, file, callback) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.minetype === "image/jpg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const { User } = require("../models/user");

router.get("/:jobId", (req, res) => {
  User.findById(req.user._id);
});

router.post("/", jsonParser, upload.single("userImage"), (req, res) => {});
