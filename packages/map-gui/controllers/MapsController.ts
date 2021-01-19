import { Router } from 'express';

const mapsRouter = Router();
const newMapsRouter = Router();
const editMapsRouter = Router();
mapsRouter.get('/', (req, res) => {
  res.render('manageMaps');
});

mapsRouter.get('/', (req, res) => {
  res.render('editMap');
});

mapsRouter.get('/', (req, res) => {
  res.render('newMap');
});

export { mapsRouter, newMapsRouter, editMapsRouter };
