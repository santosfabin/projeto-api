// src/routes/permissionVerify.js
const jwt = require('jsonwebtoken');
const config = require('../config');

function permissionVerify(req, res, next) {
  const token = req.cookies.session_id;
  if (!token) {
    return res.status(401).json({ error: 'Token JWT ausente' });
  }

  try {
    const decoded = jwt.verify(token, config.SECRET_KEY);
    req.user = decoded.user; //changed to user
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token JWT inválido' });
  }
}

module.exports = permissionVerify;
