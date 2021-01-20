import { Router } from 'express';

const registerRouter = Router();

registerRouter.get('/', (req, res) => {
  res.render('registerUser');
});

registerRouter.get('/register', (req, res) => {
  res.render('registerUser');
});

export { registerRouter };
