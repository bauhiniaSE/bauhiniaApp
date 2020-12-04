import { Router } from 'express';

const manageObjectsRouter = Router();

manageObjectsRouter.get('/', (req, res) => {
  res.render('manageObjects');
});

manageObjectsRouter.get('/maps/objects', (req, res) => {
  res.render('manageObjects');
});

export default manageObjectsRouter;
