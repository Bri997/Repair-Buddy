const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const auth = require("../middleware/auth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./uploads/");
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
const upload = multer({ storage, fileFilter });

const { User } = require("../models/user");
const { Job } = require("../models/job");

router.get("/:id", auth, (req, res) => {
  User.findById(req.user._id)
    .populate("images")
    .then(job => {
      res.json(job.images);
    })
    .catch(err => {
      res.status(500).json({ message: "Did not find the job" });
    });
});

router.post("/", jsonParser, upload.single("userImage"), (req, res) => {});

module.exports = router;
