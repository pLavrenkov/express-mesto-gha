const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();
//app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '629cc84b3ee3bf44559a89e7'
  };
  next();
});
app.use('/', usersRoutes);
app.use('/', cardsRoutes);

app.listen(PORT, () => {
  console.log(`server starts, PORT: ${PORT}`);
});
