const express = require('express')
const router = express.Router()
const userRouter = require('./userRouter')
const loginRouter = require('./loginRouter')
const logout = require('./logout')

router.use('/users', userRouter)
router.use('/login', loginRouter)
router.use('/logout', logout)

module.exports = router