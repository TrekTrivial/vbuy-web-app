const jwt = require("jsonwebtoken");
require("dotenv").config();

const redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  console.log(req.headers);

  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET_USER, (err, decoded) => {
    if (err) {
      return next();
    }

    return res.redirect(req.headers.referer || "/dashboard");
  });
};

module.exports = redirectIfAuthenticated;
