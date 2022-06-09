module.exports.handleError = (err, req, res) => {
  if (err.name === 'ValidationError') {
    res.status(400).send({ message: `Введены некорректные данные: ${err.message}` });
    return;
  }
  if (err.name === 'CastError') {
    res.status(400).send({ message: `Введены некорректные данные: ${err.message}` });
    return;
  }
  res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
};

module.exports.handleReqItemId = (item, res) => {
  if (item === null) {
    res.status(404).send({ message: 'Объект отсутствует в базе' });
    return;
  }
  res.send({ data: item });
};
