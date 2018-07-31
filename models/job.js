const mongoose = reuqire("mongoose");

const jobSchema = new mongoose.jobSchema({
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
