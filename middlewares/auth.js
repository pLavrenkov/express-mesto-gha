const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies) {
    const err = new Error('необходимо залогиниться');
    err.errorCode = 401;
    next(err);
    return;
  }
  const token = cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'secret-cat');
    console.log(payload);
  } catch (err) {
    err.errorCode = 401;
    next(err);
    return;
  }
  req.user = payload;
  next();
}