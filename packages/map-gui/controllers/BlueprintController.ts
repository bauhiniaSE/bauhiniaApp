import { Router } from 'express';

const templateRouter = Router();

templateRouter.get('/', (req, res) => {
  res.render('newTemplate');
});

templateRouter.get('/template/new', (req, res) => {
  res.render('newTemplate');
});

templateRouter.get('/template/edit', (req, res) => {
  res.render('editTemplate');
});

export { templateRouter };
