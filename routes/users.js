const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const _ = require("lodash");
const bcrypt = require("bcrypt");

const User = require("../models/user");

router.get("/", async (req, res) => {
  await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", jsonParser, async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
});

//json parser?
router.put("/user/:id", async (req, res) => {
  User.findByIdAndUpdate(req.body);
});
module.exports = router;
