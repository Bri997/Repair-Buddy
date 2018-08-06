const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const auth = require("../middleware/auth");

const { User } = require("../models/user");
const Job = require("../models/job");
const Image = require("../models/image");
router.get("/", auth, (req, res) => {
  User.findById(req.user._id)
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

router.get("/:id", auth, (req, res) => {
  Job.findById(req.params.id)

    .then(job => {
      res.json(job);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(" 500 error");
    });
});

router.post("/", auth, jsonParser, (req, res) => {
  const requiredJobFields = ["jobName"];

  for (let field of requiredJobFields) {
    if (!(field in req.body)) {
      const message = `Must enter ${field}`;
      return res.status(400).send(message);
    }
  }

  User.findById(req.user._id).then(user => {
    return Job.create({
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

router.post("/:id/image", auth, jsonParser, (req, res) => {
  Job.findById(req.params.id).then(job => {
    return Image.create({
      url: req.body.url,
      date: new Date(),
      imgDescription: req.body.imgDescription,
      tag: []
    })
      .then(image => {
        job.image.push(image._id);
        return job.save().then(job => {
          return image.save();
        });
      })
      .then(image => res.status(201).json(image))
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Post image problem", err: err });
      });
  });
});

router.put("/:id", jsonParser, auth, (req, res) => {
  if (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }
  const toBeUpadted = {};
  const updateableFields = ["description"];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toBeUpadted[field] = req.body[field];
    }
  });

  Job.findByIdAndUpdate(req.params.id, { $set: toBeUpadted })
    .then(job => res.status(204).json({ message: "Success" }))
    .catch(err => {
      res.status(500).sjon({ message: "server Error" });
    });
});
router.delete("/:id", auth, (req, res) => {
  Job.findByIdAndRemove(req.params.id)
    .then(job => res.status(204).json({ message: "Job Deleted" }))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Serve Error" });
    });
});

router.use("*", (req, res) => {
  res.status(404).json({ message: "404 Whoops not found try again" });
});
module.exports = router;
