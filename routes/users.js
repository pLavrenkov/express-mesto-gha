const router = require('express').Router();
const { getUsers, getUser, createUser, updateUser } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', createUser);
router.patch('/users/me', updateUser);

module.exports = router;
