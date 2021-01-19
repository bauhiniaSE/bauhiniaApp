import { Router } from 'express';

import { homeRouter } from './controllers/HomeController';
import { loginRouter } from './controllers/LoginController';
import { registerRouter } from './controllers/RegisterController';

import { objectsRouter } from './controllers/ObjectsController';
import { blueprintRouter } from './controllers/BlueprintController';
import { mapsRouter } from './controllers/MapsController';

const routes = Router();

routes.use('/', homeRouter);
routes.use('/login', loginRouter);
routes.use('/register', registerRouter);

routes.use('/object', objectsRouter);
routes.use('/maps', mapsRouter);
routes.use('/map/new', mapsRouter);
routes.use('/map/edit', mapsRouter);

routes.use('/blueprint', blueprintRouter);
routes.use('/blueprint/new', blueprintRouter);
routes.use('/blueprint/edit', blueprintRouter);

export default routes;
