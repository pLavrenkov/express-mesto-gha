const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
} = require('../controllers/users');
const {urlRegExp} = require('../utils/utils');
//const urlRegExp = new RegExp('^(https?:\/\/)(w{3}\.)?([a-zA-Zа-яА-Я\-\d]{2,256}\.)([a-zA-Zа-яА-Я]{2,6})(\/[\s^\/]+)*(#$)?');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24),
  }),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegExp),
  })
}), updateAvatar);

module.exports = router;
