const express = require('express');
const router = express.Router();

const characterController = require('../controller/character.controller');
const freeCompanyController = require('../controller/freeCompany.controller');

router.get("/character/search", characterController.search);
router.get("/character/:id", characterController.get);
router.get("/free-company/search", freeCompanyController.search);
router.get("/free-company/:id", freeCompanyController.get);

module.exports = router;