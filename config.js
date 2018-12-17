"use strict";

exports.AWS_SECRET_ACCESS = "CRMGAAFWd9V/Uw/v7JNorKx0qrFjEE/5J3tDtSgv";
exports.AWS_ACCESS_KEY = "AKIAJTR4N4BSDZ7KXC6Q";

exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/repairBuddy-app";
exports.TEST_DATABASE_URL =
  process.env.mongoimport || "mongodb://localhost/test-repairBuddy-app";
exports.PORT = process.env.PORT || 3000;
