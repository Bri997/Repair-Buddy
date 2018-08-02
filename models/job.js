const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  jobName: {
    type: String,
    required: true
  },
  vinNumber: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  description: {
    type: String
  },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }]
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
