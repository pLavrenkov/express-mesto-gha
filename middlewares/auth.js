const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET } = require('../utils/utils');

module.exports = (req, res, next) => {
  const { cookies } = req;
  if (!cookies) {
    const err = new Error('необходимо залогиниться');
    err.errorCode = 401;
    next(err);
    return;
  }
  const token = cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    err.errorCode = 401;
    next(err);
    return;
  }
  req.user = payload;
  next();
};
