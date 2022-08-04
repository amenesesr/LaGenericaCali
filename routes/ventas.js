const express = require('express')
const router = express.Router()


const loginController = require('../controllers/loginController')
const ventasController = require('../controllers/ventasController')

router.post('/cali/ventas/consultarCedula', loginController.autenticado, ventasController.consultarCedula)

//salir del aplicativo
router.get('/cali/logout', loginController.autenticado, loginController.logout)

module.exports = router