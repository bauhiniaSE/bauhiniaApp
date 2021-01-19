import { Router } from 'express';

const mapsRouter = Router();
const mapsUserRouter = Router();
const newMapsRouter = Router();
const editMapsRouter = Router();

mapsRouter.get('/', (req, res) => {
  res.render('manageMaps');
});

mapsUserRouter.get('/', (req, res) => {
  res.render('manageMapsUser');
});

newMapsRouter.get('/', (req, res) => {
  res.render('newMap');
});

editMapsRouter.get('/', (req, res) => {
  res.render('editMap');
});

export { mapsRouter, newMapsRouter, editMapsRouter, mapsUserRouter };
