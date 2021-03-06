import { Router } from 'express';

const blueprintRouter = Router();
const editBlueprintRouter = Router();

blueprintRouter.get('/', (req, res) => {
  res.render('newBlueprint');
});

blueprintRouter.get('/blueprint/new', (req, res) => {
  res.render('newBlueprint');
});

editBlueprintRouter.get('/', (req, res) => {
  res.render('editBlueprint');
});

export { blueprintRouter, editBlueprintRouter };
