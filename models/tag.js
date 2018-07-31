const Joi = require("joi");
const mongoose = require("mongoose");

const tagSchema = new mongoose.tagSchema({
  tag: {
    type: String,
    minlenght: 3
  }
});

const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;
