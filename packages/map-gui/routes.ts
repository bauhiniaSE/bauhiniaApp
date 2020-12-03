import { Router } from 'express';

import usersRouter from './controllers/UsersController';
import loginRouter from './controllers/LoginController';
import registerRouter from './controllers/RegisterController';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/login', loginRouter);
routes.use('/register', registerRouter);
export default routes;
