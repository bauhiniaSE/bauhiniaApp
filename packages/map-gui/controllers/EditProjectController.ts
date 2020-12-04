import { Router } from 'express';

const editProjectRouter = Router();

editProjectRouter.get('/', (req, res) => {
  res.render('editProject');
});

editProjectRouter.get('/game/edit', (req, res) => {
  res.render('editProject');
});

export default editProjectRouter;
