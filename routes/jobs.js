const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const User = require("../models/user");
const Job = require("../models/job");

router.get("/", (req, res) => {
  User.findById(req.user)
    .populate({
      path: "jobs"
    })
    .then(user => {
      res.json(user.jobs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("500 error ");
    });
});

router.post("/", jsonParser, (req, res) => {
  const requiredJobFields = ["jobName"];

  for (let field of requiredJobFields) {
    if (!(field in req.body)) {
      const message = `Must enter ${field}`;
      return res.status(400).send(message);
    }
  }

  User.findById(req.user._id).then(user => {
    return Job.Create({
      jobName: req.body.jobName,
      vinNumber: req.body.vinNumber,
      startDate: new Date(),
      endDate: req.body.endDate || "",
      description: req.body.description || ""
    })
      .then(job => {
        job.user = user._id;
        user.jobs.push(job._id);
        return user.save().then(user => {
          return job.save();
        });
      })
      .then(job => res.status(201).json(job))
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
      });
  });
});

module.exports = router;
