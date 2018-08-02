const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlenght: 3,
    maxlenght: 55
  },
  email: {
    type: String,
    required: true,
    minlenght: 5,
    maxlenght: 255,
    unique: true
  },

  password: {
    type: String,
    required: true,
    minlenght: 5,
    maxlenght: 255
  },
  jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }]
});
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
