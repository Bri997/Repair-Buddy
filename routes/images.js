const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "newuploads/");
  },
  filename: function(req, file, callback) {
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") +
        path.extname(file.originalname)
    );
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
const Image = require("../models/image");
const Tag = require("../models/tag");

router.get("/", auth, (req, res) => {
  Image.findById(req.params.id)

    .then(image => {
      res.json(image);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Did not find the job", err: err });
    });
});
router.get("/:id", auth, (req, res) => {
  Image.findById(req.params.id)

    .then(image => {
      res.json(image);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Did not find the job", err: err });
    });
});

router.post(
  "/:id",
  jsonParser,
  auth,
  upload.single("userImage"),
  (req, res) => {
    // const requiredJobFields = ["jobName"];

    // for (let field of requiredJobFields) {
    //   if (!(field in req.body)) {
    //     const message = `Must enter ${field}`;
    //     return res.status(400).send(message);
    //   }
    // }

    Job.findById(req.params._id).then(job => {
      console.log(Job);
      return Image.create({
        url: req.body,
        date: new Date(),
        imgDescription: "",
        tag: "Tag"
      })
        .then(image => {
          image.user = user._id;
          user.images.push(image._id);
          return user.save().then(user => {
            return image.save();
          });
        })
        .then(image => res.status(201).json(image))
        .catch(err => {
          console.log(err);
          res.status(500).json({ message: "Post Problem", err: err });
        });
    });
  }
);

router.post("/:id/tag", jsonParser, auth, (req, res) => {
  Image.findById(req.params.id).then(image => {
    return Tag.create({
      tag: req.body.tag
    })
      .then(tag => {
        image.tag.push(tag._id);
        return image.save().then(image => {
          return tag;
        });
      })
      .then(tag => res.status(201).json(tag))
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Tag post problem", err });
      });
  });
});

module.exports = { upload, router };

// website.com/user/82109381/job/091312098/images/982347938
