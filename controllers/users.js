const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET } = require('../utils/utils');
const User = require('../models/user');
const { handleReqItemId } = require('../utils/utils');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      handleReqItemId(user, res, next);
      res.send(user);
    })
    .catch((err) => {
      if (err.errorCode === 404) {
        next(err);
      }
      err.message = 'некорректный id пользователя';
      err.errorCode = 400;
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      handleReqItemId(user, res, next);
      res.send(user);
    })
    .catch((err) => {
      if (err.errorCode === 404) {
        next(err);
      }
      err.message = 'некорректный id пользователя';
      err.errorCode = 400;
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!password || !email) {
    const err = new Error('email или пароль введен некорректно');
    err.errorCode = 400;
    next(err);
    return;
  }
  if (!validator.isEmail(email) || !password || !email) {
    const err = new Error('email введен некорректно');
    err.errorCode = 400;
    next(err);
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        const err = new Error(`пользователь с таким email: ${email}, уже существует`);
        err.errorCode = 409;
        next(err);
        return;
      }
      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            name, about, avatar, email, password: hash,
          })
            .then((newuser) => res.status(201).send({
              name: newuser.name,
              about: newuser.about,
              avatar: newuser.avatar,
              email: newuser.email,
              _id: newuser._id,
            }))
            .catch((err) => {
              err.errorCode = 400;
              next(err);
            });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.errorCode = 400;
        next(err);
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.errorCode = 400;
        next(err);
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { password } = req.body;
  if (!req.body.email || !req.body.password) {
    res.status(400).send({ message: 'Не заполнены email или пароль' });
    return;
  }
  const email = req.body.email.toLowerCase();
  if (!validator.isEmail(email)) {
    res.status(400).send({ message: 'Email введен некорректно' });
    return;
  }
  User.findUserByCredentials(res, next, email, password)
    .then((user) => {
      if (user) {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res
          .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
          .status(200).send({
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
      }
    })
    .catch(next);
};
