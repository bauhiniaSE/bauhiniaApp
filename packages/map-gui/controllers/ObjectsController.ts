import { Router } from 'express';

const objectsRouter = Router();

objectsRouter.get('/', (req, res) => {
  res.render('manageObjects');
});

export { objectsRouter };
