const InternalServerError = require('../companents/InternalServerError');
const NotFoundError = require('../companents/NotFoundError');

module.exports.handleError = (err, _req, res, next) => {
  if (!err.statusCode) {
    const error = new InternalServerError(`Произошла ошибка: ${err.message}`);
    return next(res.status(error.statusCode).send({ message: error.message }));
  }
  return next(res.status(err.statusCode).send({ message: err.message }));
};

module.exports.handleReqItemId = (item, res, next) => {
  if (item !== null) {
    return item;
  }
  const err = new NotFoundError('объект с такими параметрами отсутствует или удален');
  return next(err);
};

module.exports.urlRegExp = /^(https?:\/\/)(w{3}\\.)*([a-zA-Zа-яА-Я\-_\d]{2,256}\.)+([a-zA-Zа-яА-Я]{2,6})(\/?[\S]*)*?(#$)?/i;

module.exports.JWT_SECRET = 'secret-cat';
