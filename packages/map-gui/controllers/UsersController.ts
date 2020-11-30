import { Router } from 'express';

import User from '../models/User';

const usersRouter = Router();

usersRouter.get('/', (req, res) => {
  let users: User[] = [new User('Test User', 'One'), new User('Test User', 'Two')];
  res.render('usersList', { usersList: users });
});

usersRouter.get('/user', (req, res) => {
  if (typeof req.query.firstname !== 'undefined' && typeof req.query.lastname !== 'undefined') {
    let firstname = String(req.query.firstname);
    let lastname = String(req.query.lastname);
    let user = new User(firstname, lastname);
    res.render('userDetails', { user: user });
  } else {
    res.status(400).end();
  }
});

export default usersRouter;
