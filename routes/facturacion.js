const express = require('express')
const router = express.Router()

const loginController = require('../controllers/loginController')
const facturacionController = require('../controllers/facturacionController')

//mapping cargar factura
router.post('/cali/facturacion/consultarConsecutivo', loginController.autenticado, facturacionController.consultarConsecutivo)

//salir del aplicativo
router.get('/cali/logout', loginController.autenticado, loginController.logout)

module.exports = router