const express = require('express')
const router = express.Router()

const loginController = require('../controllers/loginController')
const facturaController = require('../controllers/facturaController')

//mapping cargar factura
router.post('/cali/factura', loginController.autenticado, facturaController.mostrar)

//salir del aplicativo
router.get('/cali/logout', loginController.autenticado, loginController.logout)

module.exports = router