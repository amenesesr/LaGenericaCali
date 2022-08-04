const express = require('express')
const router = express.Router()

const loginController = require('../controllers/loginController')
const registrosController = require('../controllers/registrosController')

//mapping limpiar registros
router.get('/cali/registros/limpiar', loginController.autenticado, registrosController.limpiar)

module.exports = router
