import { Router } from 'express';

const viewPictureRouter = Router();

viewPictureRouter.get('/', (req, res) => {
  res.render('viewPicture');
});

viewPictureRouter.get('/maps/picture', (req, res) => {
  res.render('viewPicture');
});

export default viewPictureRouter;
