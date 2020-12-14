import { Router } from 'express';

import usersRouter from './controllers/UsersController';

import homeRouter from './controllers/HomeController';
import loginRouter from './controllers/LoginController';
import registerRouter from './controllers/RegisterController';
import startGameRouter from './controllers/StartGameController';
import manageMapsRouter from './controllers/ManageMapsController';
import editProjectRouter from './controllers/EditProjectController';
import viewPictureRouter from './controllers/ViewPictureController';
import manageObjectsRouter from './controllers/ManageObjectsController';

const routes = Router();

routes.use('/users', usersRouter);

routes.use('/', homeRouter);
routes.use('/login', loginRouter);
routes.use('/register', registerRouter);
routes.use('/game', startGameRouter);
routes.use('/game/edit', editProjectRouter);
routes.use('/maps', manageMapsRouter);
routes.use('/maps/picture', viewPictureRouter);
routes.use('/maps/objects', manageObjectsRouter);

export default routes;
