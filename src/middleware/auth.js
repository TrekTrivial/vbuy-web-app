const jwt = require("jsonwebtoken");

const auth = (a, b) => {
  return a + b;
};

module.exports = auth;
