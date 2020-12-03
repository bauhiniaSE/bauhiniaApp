import { Router } from 'express';

import usersRouter from './controllers/UsersController';

import homeRouter from './controllers/HomeController';
import loginRouter from './controllers/LoginController';
import registerRouter from './controllers/RegisterController';
import startGameRouter from './controllers/StartGameController';

const routes = Router();

routes.use('/users', usersRouter);

routes.use('/', homeRouter);
routes.use('/login', loginRouter);
routes.use('/register', registerRouter);
routes.use('/game', startGameRouter);

export default routes;
