const express = require('express')
const router = express.Router()


const loginController = require('../controllers/loginController')
const ventasProductosController = require('../controllers/ventasProductosController')

//mapping cargar ventas
//router.get('/ventas', loginController.autenticado, ventasController.cargar)

router.post('/cali/ventasProductos', loginController.autenticado, ventasProductosController.registrarproducto)

//mapping cancelar e inicar una nueva venta
router.get('/cali/ventasProductos/nuevaVenta', loginController.autenticado, ventasProductosController.nuevaVenta)

//mapping registrar ventas
router.post('/cali/ventasProductos/registrar', ventasProductosController.registrar)
//router.post('/factura', loginController.autenticado, ventasController.registrar)

//mapping eliminar ventas
router.post('/cali/ventasProductos/eliminar/:codigo_producto_temp', loginController.autenticado, ventasProductosController.eliminar)

//salir del aplicativo
router.get('/cali/logout', loginController.autenticado, loginController.logout)

module.exports = router