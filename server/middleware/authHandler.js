require('dotenv').config()
const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/responseHelper");
const { INVALID_TOKEN, TOKEN_REQUIRED } = require("../utils/messageHelper");

const secretKey = process.env.JWT_SECRET;

const authHandler = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return errorResponse(res,403,TOKEN_REQUIRED)
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return errorResponse(res,403,TOKEN_REQUIRED)
  }

  try {
    const decodedToken = jwt.verify(token, secretKey)
    req.user = decodedToken.id;
    next();
  } catch (error) {
    next(error)
  }
};

module.exports = authHandler;
