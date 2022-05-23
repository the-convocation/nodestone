import express from 'express';
import router from './router/router';
import cors from './middleware/cors';
import options from './middleware/options';

const app = express();
export default function () {
  app.use(cors);
  app.use(options);
  app.use(router);
  return app;
}
