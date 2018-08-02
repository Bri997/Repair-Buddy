const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const auth = require("../middleware/auth");
const { User } = require("../models/user");

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

module.exports = router;
