const Joi = require("joi");
const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  imgDescription: {
    type: String
  },
  tag: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }]
});

const Image = mongoose.model("Image", imageSchema, "Image");

module.exports = Image;
