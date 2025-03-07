// src/routes/loginRouter.js
const express = require('express');
const loginRouter = express.Router();
const loginController = require('../controllers/loginController');

loginRouter.post('/', loginController.autenticate);
loginRouter.get('/', loginController.getLogin)

module.exports = loginRouter;
