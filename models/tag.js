const Joi = require("joi");
const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  tag: {
    type: String,
    minlenght: 3
  }
});

const Tag = mongoose.model("Tag", tagSchema, "Tag");

module.exports = Tag;
