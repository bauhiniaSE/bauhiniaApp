import * as path from 'path';

import * as express from 'express';

import routes from './routes';

const app = express();
const PORT = 8000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.send('Main route'));

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
