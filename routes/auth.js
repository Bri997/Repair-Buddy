const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const auth = require("../middleware/auth");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const _ = require("lodash");
const bcrypt = require("bcrypt");

const { User } = require("../models/user");

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email }).populate({
    path: "jobs",
    populate: {
      path: "images",
      model: "Image"
    }
  });
  if (!user) return res.status(400).send("Invalid email or password.");

  const vaildPassword = await bcrypt.compare(req.body.password, user.password);
  if (!vaildPassword) return res.status(400).send("Invalid email or password.");

  jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"), (error, token) => {
    user.token = token;
    res.json(user.serialize());
  });
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };

  return Joi.validate(req, schema);
}
module.exports = router;
