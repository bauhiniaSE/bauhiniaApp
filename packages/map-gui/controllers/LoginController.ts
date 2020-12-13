import { Router } from 'express';

const loginRouter = Router();

// zeby css byl w osobnym pliku
// var express = require('express');

// var app = express();

// app.use(express.static(__dirname + '/css_style/logIn.css'));

loginRouter.get('/', (req, res) => {
  res.render('logIn');
});

loginRouter.get('/login', (req, res) => {
  res.render('logIn');
});
// 'message a'.link()
// '.message a'.click(function () {
//   'form'.animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
// });

export default loginRouter;
