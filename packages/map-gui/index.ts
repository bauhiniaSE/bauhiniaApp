import * as path from 'path';

import * as express from 'express';

import routes from './routes';

const app = express();
const PORT = 8000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname));
app.use('/map-builder', express.static(__dirname + '/node_modules/bauhinia-map-builder/dist/'));
app.use('/map-manager', express.static(__dirname + '/node_modules/bauhinia-map-manager/dist/'));
app.use('/save-system', express.static(__dirname + '/node_modules/bauhinia-save-system/'));
app.use('/simulation-service', express.static(__dirname + '/node_modules/bauhinia-simulation-service/dist/'));

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
