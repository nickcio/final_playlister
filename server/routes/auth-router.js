const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth-controller')

router.get('/user', AuthController.getUser)
router.post('/register', AuthController.registerUser)
router.post('/login', AuthController.loginUser)
router.get('/logout', AuthController.logoutUser)
router.get('/loggedIn', AuthController.getLoggedIn)

module.exports = router