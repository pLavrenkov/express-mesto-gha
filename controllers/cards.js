const Card = require('../models/card');
const { handleReqItemId } = require('../utils/utils');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      const error = err;
      error.message = 'некорректные данные о карточке';
      error.errorCode = 400;
      next(error);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      handleReqItemId(card, res, next);
      if (card.owner.toString() !== req.user._id) {
        const err = new Error('нельзя удалаять чужую карточку');
        err.errorCode = 403;
        next(err);
        return;
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((cardn) => {
          handleReqItemId(cardn, res, next);
          res.send(cardn);
        })
        .catch((err) => {
          const error = err;
          error.message = 'некорректные данные о карточке';
          error.errorCode = 400;
          next(error);
        });
    })
    .catch((err) => {
      const error = err;
      error.message = 'некорректные данные о карточке';
      error.errorCode = 400;
      next(error);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      handleReqItemId(card, res, next);
      res.send(card);
    })
    .catch((err) => {
      const error = err;
      error.message = 'некорректные данные о карточке';
      error.errorCode = 400;
      next(error);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        handleReqItemId(card, res, next);
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      const error = err;
      error.message = 'некорректные данные о карточке';
      error.errorCode = 400;
      next(error);
    });
};
