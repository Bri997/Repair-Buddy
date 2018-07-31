const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.userSchema({
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
  job: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
