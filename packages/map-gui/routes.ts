import { Router } from 'express';

import { homeRouter } from './controllers/HomeController';
import { loginRouter } from './controllers/LoginController';
import { registerRouter } from './controllers/RegisterController';

import { objectsRouter } from './controllers/ObjectsController';
import { templateRouter } from './controllers/TemplateController';
import { mapsRouter } from './controllers/MapsController';

const routes = Router();

routes.use('/', homeRouter);
routes.use('/login', loginRouter);
routes.use('/register', registerRouter);

routes.use('/object', objectsRouter);
routes.use('/object/edit', objectsRouter);
routes.use('/object/new', objectsRouter);
routes.use('/maps', mapsRouter);
routes.use('/map/new', mapsRouter);
routes.use('/map/edit', mapsRouter);

routes.use('/template', templateRouter);
routes.use('/template/new', templateRouter);
routes.use('/template/edit', templateRouter);

export default routes;
