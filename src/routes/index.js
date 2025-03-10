const express = require('express')
const router = express.Router()
const userRouter = require('./userRouter')
const activityRouter = require('./activityRouter')
const loginRouter = require('./loginRouter')
const logout = require('./logout')

router.use('/users', userRouter)
router.use('/createAcvitity', activityRouter)
router.use('/login', loginRouter)
router.use('/logout', logout)

module.exports = router