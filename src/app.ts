import express from "express";

const app = express();
const router = require('./router/router');

const cors = require('./middleware/cors');
const options = require('./middleware/options');

export default function () {
  app.use(cors);
  app.use(options);
  app.use(router);
  return app;
}