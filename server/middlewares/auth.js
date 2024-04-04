const jwt = require("jsonwebtoken");
require("dotenv").config();
const httpStatus = require("http-status");
const userService = require("../services/user.service");
const { ApiError } = require("./error-handling-middleware");

const auth = () => async (req, res, next) => {
  try {
    let authHeader = req.headers["authorization"];

    let accessToken = authHeader && authHeader.split(" ")[1];

    console.log(accessToken);
    if (!accessToken) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized user!");
    }

    jwt.verify(accessToken, process.env.APP_SECRET, (err, user) => {
      if (err) {
        throw new ApiError(httpStatus.FORBIDDEN, "Unauthorized user! - Invalid Token");
      } else {
        req.authenticated = user;
        next();
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
