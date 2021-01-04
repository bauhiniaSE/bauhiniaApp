import { Router } from 'express';

import User from '../models/User';

const usersRouter = Router();

usersRouter.get('/', (req, res) => {
  const users: User[] = [new User('Test User', 'One'), new User('Test User', 'Two')];
  res.render('usersList', { usersList: users });
});

usersRouter.get('/user', (req, res) => {
  if (typeof req.query.firstname !== 'undefined' && typeof req.query.lastname !== 'undefined') {
    const firstname = String(req.query.firstname);
    const lastname = String(req.query.lastname);
    const user = new User(firstname, lastname);
    res.render('userDetails', { user: user });
  } else {
    res.status(400).end();
  }
});

export default usersRouter;
