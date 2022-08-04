const express = require('express')
const router = express.Router()

const loginController = require('../controllers/loginController')
const { validateLogin } =require ('../validaciones/Login')

//mapping login
router.get('/cali/login', loginController.mostrar)

router.post('/cali/login', validateLogin, loginController.login)

router.get('/cali/logout', loginController.logout)

module.exports = router
