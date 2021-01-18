import { Router } from 'express';

const objectsRouter = Router();

objectsRouter.get('/', (req, res) => {
  res.render('manageObjects');
});

objectsRouter.get('/object/edit', (req, res) => {
  res.render('editObject');
});

objectsRouter.get('/object/new', (req, res) => {
  res.render('newObject');
});

export { objectsRouter };
