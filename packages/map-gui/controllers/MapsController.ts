import { Router } from 'express';

const mapsRouter = Router();

mapsRouter.get('/', (req, res) => {
  res.render('manageMaps');
});

mapsRouter.get('/map/edit', (req, res) => {
  res.render('editMap');
});

mapsRouter.get('/map/new', (req, res) => {
  res.render('newMap');
});

export { mapsRouter };
