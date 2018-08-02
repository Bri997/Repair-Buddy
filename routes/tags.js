const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const Tag = require("../models/tag");

router.get("/", auth, (req, res) => {
  User.findById(req.user._id)
    .populate({
      path: "tags"
    })
    .then(user => {
      res.json(user.tags);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("500 error");
    });
});

router.post("/", auth, jsonParser, (req, res) => {
  const requireTagField = ["tag"];

  for (let field of requireTagField) {
    if (!(field in req.body)) {
      const message = "Must enter a tag";
      return res.status(400).send(message);
    }
  }
  User.findById(req.user._id).then(user => {
    return Tag.create({
      tag: req.body.tag
    })
      .then(tag => {
        tag.user = user._id;
        user.tags.push(tag._id);
        return user.save().then(user => {
          return tag.save();
        });
      })
      .then(tag => res.status(201).json(tag))
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
      });
  });
});

module.exports = router;
