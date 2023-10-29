const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const decoded = jwt.verify;
  next();
};
