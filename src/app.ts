import express from "express";

const app = express();

const characterController = require('./controller/character.controller');
const freeCompanyController = require('./controller/freeCompany.controller');

export default function () {

  app.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    else {
      next();
    }
  });

  app.get("/character/search", characterController.search);
  app.get("/character/:id", characterController.get);
  app.get("/free-company/search", freeCompanyController.search);
  app.get("/free-company/:id", freeCompanyController.get);

  return app;
}