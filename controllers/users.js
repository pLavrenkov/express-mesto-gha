const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET } = require('../utils/utils');
const User = require('../models/user');
const { handleReqItemId } = require('../utils/utils');
const BadRequestError = require('../companents/BadRequestError');
const ConflictError = require('../companents/ConflictError');

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
      if (err.statusCode === 404) {
        next(err);
      }
      const error = new BadRequestError('некорректный ID пользователя');
      next(error);
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
      const error = new BadRequestError('некорректный ID пользователя');
      next(error);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  /* if (!password || !email) {
    const err = new Error('email или пароль введен некорректно');
    err.errorCode = 400;
    next(err);
    return;
  } */
  if (!validator.isEmail(email)) {
    const err = new BadRequestError('Email введен некорректно');
    next(err);
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        const err = new ConflictError(`Пользователь с таким email: ${email}, уже существует`);
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
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError('введены некорректные данные');
        next(error);
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
        const error = new BadRequestError('введены некорректные данные');
        next(error);
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { password } = req.body;
  if (!req.body.email || !req.body.password) {
    const error = new BadRequestError('не заполнены email или пароль');
    next(error);
    return;
  }
  const email = req.body.email.toLowerCase();
  if (!validator.isEmail(email)) {
    const error = new BadRequestError('email введен некорректно');
    next(error);
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
