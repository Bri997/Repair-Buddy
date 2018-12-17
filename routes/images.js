const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const config = require("../config");

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

aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS,
  accessKeyId: config.AWS_ACCESS_KEY,
  region: "us-east-1"
});
const s3 = new aws.S3();

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: "repairbuddy-images",
    acl: "public-read-write",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString() + file.originalname.toLowerCase());
    }
  })
});

const { User } = require("../models/user");
const Job = require("../models/job");
const Image = require("../models/image");
const Tag = require("../models/tag");

router.get("/", auth, (req, res) => {
  Image.find()

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
    User.findById(req.user._id).then(user => {
      Job.findById(req.params.id).then(job => {
        return Image.create({
          url: req.file.location,
          date: new Date(),
          imgDescription: req.body.description
        })
          .then(image => {
            user.images.push(image._id);
            return user.save().then(user => {
              job.images.push(image._id);
              return job.save().then(job => {
                return image;
              });
            });
          })
          .then(image => res.status(201).json(image))
          .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Post Problem", err: err });
          });
      });
    });
  }
);

router.delete("/:id/:jobId", auth, async (req, res) => {
  let image = await Image.findById(req.params.id);
  let job = await Job.findById(req.params.jobId);

  let imageToDelete = image.url.replace(
    "https://repairbuddy-images.s3.amazonaws.com/",
    ""
  );

  // let item = req.body;
  let params = { Bucket: "repairbuddy-images", Delete: { Key: imageToDelete } };
  await s3.deleteObjects(params, function(err, data) {
    console.log("here");
    if (err) {
      return res.send({ error: err });
    } else {
      console.log(data);
    }
  });

  let indexofImage = job.images.findIndex(i => i === req.params.jobId);

  job.images.splice(indexofImage, 1);
  await job.save();

  Image.findByIdAndRemove(req.params.id).then(image =>
    res.status(204).json({ message: "Image Deleted" })
  );
});

router.get("/:id/tag/", jsonParser, auth, (req, res) => {
  Image.findById(req.params.id)
    .then(image => {
      res.json(tag);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Tag err" });
    });
});

router.post("/:id/tag/", jsonParser, auth, (req, res) => {
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

router.delete("/:id/tag/:tagId", jsonParser, auth, async (req, res) => {
  let image = await Image.findById(req.params.id);
  const tagId = Tag.findByIdAndRemove(req.params.tagId);

  const tagToDelete = image.tag.indexOf(tagId);

  image.tag.splice(tagToDelete, 1);

  image
    .save()
    .then(image => {
      return res.status(200).json(image);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Tag delete problem" });
    });
});
module.exports = { upload, router };
