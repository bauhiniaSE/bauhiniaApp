import { Router } from 'express';

import usersRouter from './controllers/UsersController';

const routes = Router();

routes.use('/users', usersRouter);

export default routes;
