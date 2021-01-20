import { Router } from 'express';

const loginRouter = Router();

loginRouter.get('/', (req, res) => {
  res.render('logIn');
});

export { loginRouter };
