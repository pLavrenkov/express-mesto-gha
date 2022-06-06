module.exports.handleError = (err, res) => {
  if (err.name === 'ValidationError') {
    res.status(400).send({ message: `Введены некорректные данные: ${err.message}` });
    return
  };
  if (err.name === 'CastError') {
    res.status(404).send({ message: `Данные не обнаружены: ${err.message}` });
    return
  };
  res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
}
