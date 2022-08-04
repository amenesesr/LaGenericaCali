const express = require('express')
const router = express.Router()

const loginController = require('../controllers/loginController')
const consultaCedulaController = require('../controllers/consultaCedulaController')

//mapping cargar factura
router.post('/cali/consultaCedula', loginController.autenticado, consultaCedulaController.mostrar)

//salir del aplicativo
router.get('/cali/logout', loginController.autenticado, loginController.logout)

module.exports = router