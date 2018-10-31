const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const Image = require("../models/image");
const Tag = require("../models/tag");

router.get("/", auth, (req, res) => {
  Tag.find()

    .then(tag => {
      res.json(tag);
    })
    .catch(err => {
      res.status(500).send("500 error");
    });
});

module.exports = router;
