import { Router } from 'express';

import usersRouter from './controllers/UsersController';
import loginRouter from './controllers/LoginController';
import registerRouter from './controllers/RegisterController';
import homeRouter from './controllers/HomeController';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/login', loginRouter);
routes.use('/register', registerRouter);
routes.use('/', homeRouter);
export default routes;
