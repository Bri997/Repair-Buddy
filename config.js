"use strict";
exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/repairBuddy-app";
exports.TEST_DATABASE_URL =
  process.env.mongoimport || "mongodb://localhost/test-repairBuddy-app";
exports.PORT = process.env.PORT || 3000;
