module.exports.handleError = (err, req, res) => {
  if (err.name === 'ValidationError') {
    res.status(400).send({ message: `Введены некорректные данные: ${err.message}` });
    return;
  }
  if (err.name === 'CastError') {
    res.status(400).send({ message: `Данные не найдены: ${err.message}` });
    return;
  }
  res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
};

module.exports.handleCodeError = (err, res) => {
  if (err.errorCode === 400) {
    res.status(err.errorCode).send({ message: `Введены некорректные данные: ${err.message}` });
    return;
  }
  if (err.errorCode === 401) {
    res.status(401).send({ message: `Необходима авторизация: ${err.message}` });
    return;
  }
  if (err.errorCode === 403) {
    res.status(403).send({ message: `Неавторизованные действия: ${err.message}` });
    return;
  }
  if (err.errorCode === 404) {
    res.status(404).send({ message: `Данные не найдены: ${err.message}` });
    return;
  }
  if (err.errorCode === 409) {
    res.status(409).send({ message: `Пользователь уже зарегистрирован: ${err.message}` });
    return;
  }
  res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
};

module.exports.handleReqItemId = (item, res, next) => {
  if (item !== null) {
    return item;
  }
  const err = new Error('объект с такими параметрами отсутствует или удален');
  err.errorCode = 404;
  return next(err);
};

module.exports.urlRegExp = /^(https?:\/\/)(w{3}\\.)*([a-zA-Zа-яА-Я\-_\d]{2,256}\.)+([a-zA-Zа-яА-Я]{2,6})(\/?[\S]*)*?(#$)?/i;

module.exports.JWT_SECRET = 'secret-cat';
