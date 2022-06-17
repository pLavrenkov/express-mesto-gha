const mongoose = require('mongoose');

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
  },
  password: {
    type: String,
    required: [true, 'Не заполнен пароль'],
    minlength: [2, 'Длина пароля должна быть не менее 2х символов'],
  },
});

module.exports = mongoose.model('user', userSchema);
