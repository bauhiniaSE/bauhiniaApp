import { Router } from 'express';

const blueprintRouter = Router();

blueprintRouter.get('/', (req, res) => {
  res.render('newBlueprint');
});

blueprintRouter.get('/blueprint/new', (req, res) => {
  res.render('newBlueprint');
});

blueprintRouter.get('/blueprint/edit', (req, res) => {
  res.render('editBlueprint');
});

export { blueprintRouter };
