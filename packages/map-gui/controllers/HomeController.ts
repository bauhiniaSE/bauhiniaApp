import { Router } from 'express';

const homeRouter = Router();

homeRouter.get('/', (req, res) => {
  res.render('home');
});

export { homeRouter };
