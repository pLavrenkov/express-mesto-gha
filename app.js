const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const {
  createUser,
  login,
} = require('./controllers/users');
const { handleCodeError } = require('./utils/utils');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(cookieParser());

/*app.use((req, _res, next) => {
  req.user = {
    _id: '629cc8283ee3bf44559a89e5',
  };
  next();
});*/

app.use('/signup', createUser);
app.use('/signin', login);

app.use(auth);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use((err, _req, res, _next) => handleCodeError(err, res));
app.use((_req, res) => res.status(404).send({ message: 'Невозможно отобразить страницу' }));

app.listen(PORT);
