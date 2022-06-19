const router = require('express').Router();
const {celebrate, Joi} = require("celebrate");
const {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(5).max(30),
    about: Joi.string().min(2),
  }),
}), updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
