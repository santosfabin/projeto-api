// src/routes/logoutRouter.js
const express = require('express');
const logoutRouter = express.Router();

logoutRouter.get('/', (req, res) => {
  res.cookie('session_id', '', { expires: new Date(0), httpOnly: true });
  res.redirect('/');
});

module.exports = logoutRouter;
