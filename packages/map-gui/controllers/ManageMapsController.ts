import { Router } from 'express';

const manageMapsRouter = Router();

manageMapsRouter.get('/', (req, res) => {
  res.render('manageMaps');
});

manageMapsRouter.get('/maps', (req, res) => {
  res.render('manageMaps');
});

export default manageMapsRouter;
