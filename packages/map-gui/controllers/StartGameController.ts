import { Router } from 'express';

const startGameRouter = Router();

startGameRouter.get('/', (req, res) => {
  res.render('startGame');
});

startGameRouter.get('/game', (req, res) => {
  res.render('startGame');
});

export default startGameRouter;
