const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Длина имени пользователя должна быть не менее 2х символов'],
    maxlength: [30, 'Длина имени пользователя должна быть не более 30ти символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Длина имени пользователя должна быть не менее 2х символов'],
    maxlength: [30, 'Длина имени пользователя должна быть не более 30ти символов'],
    default: 'Ислледователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: [true, 'Не заполнен e-mail'],
    minlength: [2, 'Длина email должна быть не менее 2х символов'],
    maxlength: [30, 'Длина email должна быть не более 30ти символов'],
    unique: [true, 'Пользователь с таким email уже есть'],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Не заполнен пароль'],
    minlength: [2, 'Длина пароля должна быть не менее 2х символов'],
  },
});

userSchema.statics.findUserByCredentials = function (res, next, email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        const err = new Error('неправильные почта или пароль');
        err.errorCode = 400;
        return next(err);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const err = new Error('неправильные почта или пароль');
            err.errorCode = 400;
            return next(err);
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
