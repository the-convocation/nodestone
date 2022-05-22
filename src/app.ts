import express from "express";

const app = express();

const cors = require('./middleware/cors');
const options = require('./middleware/options');

const characterController = require('./controller/character.controller');
const freeCompanyController = require('./controller/freeCompany.controller');

export default function () {

  app.use(cors);
  app.use(options);

  app.get("/character/search", characterController.search);
  app.get("/character/:id", characterController.get);
  app.get("/free-company/search", freeCompanyController.search);
  app.get("/free-company/:id", freeCompanyController.get);

  return app;
}