const express = require("express");
const { PORT, DATABASE_URL } = require("./config");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const jobsRouter = require("./routes/jobs");
const userRouter = require("./routes/users");

const app = express();
app.use(express.static("Public"));
app.use(jsonParser);

app.use("/users", userRouter);
app.use("/jobs", jobsRouter);

// make upload folder available
app.use("/uploads", express.static("uploads"));

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
