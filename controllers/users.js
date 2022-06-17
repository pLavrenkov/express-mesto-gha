const validator = require('validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { handleError, handleReqItemId } = require('../utils/utils');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => handleError(err, req, res));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => handleReqItemId(user, res))
    .catch((err) => handleError(err, req, res));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!validator.isEmail(email)) {
    res.status(400).send({ message: 'Email введен некорректно' });
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(409).send({ message: `Пользователь с таким email: ${email}, уже существует` });
        return;
      }
      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            name, about, avatar, email, password: hash,
          })
            .then((newuser) => res.send({ user: newuser }))
            .catch((err) => handleError(err, req, res));
        })
        .catch((err) => handleError(err, req, res));
    })
    .catch((err) => handleError(err, req, res));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => handleError(err, req, res));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => handleError(err, req, res));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: 'Не заполнены email или пароль' });
    return;
  }
  if (!validator.isEmail(email)) {
    res.status(400).send({ message: 'Email введен некорректно' });
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(401).send({ message: 'Пользователь не найден, неверные почта или пароль' });
        return;
      }
      bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        res.status(401).send({ message: 'Пользователь не найден, неверные почта или пароль' });
        return;
      }
      res.send({ message: 'Пользователь обранужен' });
    })
    .catch((err) => handleError(err, req, res));
};
