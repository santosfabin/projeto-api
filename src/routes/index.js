// src/routes/index.js
const express = require('express');
const router = express.Router();
const userRouter = require('./userRouter');
const loginRouter = require('./loginRouter');
const {activityRouter} = require('./activityRouter'); //only activityRouter
const logoutRouter = require('./logoutRouter')
const permissionVerify = require('./permissionVerify');

router.use('/api/users', userRouter);
router.use('/api/login', loginRouter);
router.use('/api/activities', permissionVerify, activityRouter); //added the middleware
router.use('/logout', logoutRouter);

module.exports = router;
