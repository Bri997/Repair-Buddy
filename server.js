const express = require("express");
const { PORT, DATABASE_URL } = require("./config");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const userRouter = require("./routes/users");
const jobsRouter = require("./routes/jobs");
const { router: imageRouter } = require("./routes/images");
const tagsRouter = require("./routes/tags");
const auth = require("./routes/auth");
const app = express();
const cors = require("cors");

app.use(
  cors({
    exposedHeaders: ["x-auth-token"]
  })
);
app.use(express.static("public"));
app.use(jsonParser);

app.use("/user", userRouter);
app.use("/job", jobsRouter);
app.use("/image", imageRouter);
app.use("/tag", tagsRouter);
app.use("/login", auth);
app.use("./uploads", express.static("newuploads"));

mongoose.Promise = global.Promise;

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`App is ready on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing your favorite server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.log(err));
}

module.exports = { app, runServer, closeServer };
