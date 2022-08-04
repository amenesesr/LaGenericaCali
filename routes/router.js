const { Router } = require('express')
const express = require('express')
const {
    vistaProductos,
    vistaProveedores,
    vistaUsuarios,
    vistaClientes,
    vistaVentas,
    vistaVentasProductos,
    vistaReportes,
    vistaFactura,
    vistaFacturacion,
    vistaConsultaCedula,
    vistaRegistros
    } = require('../controllers/pageController.js')

const router = express.Router ()

const loginController = require('../controllers/loginController')

router.get('/cali/productos',loginController.autenticado, vistaProductos)

router.get('/cali/proveedores',loginController.autenticado, vistaProveedores)

router.get('/cali/usuarios',loginController.autenticado, vistaUsuarios)

router.get('/cali/clientes',loginController.autenticado, vistaClientes)

router.get('/cali/ventas',loginController.autenticado, vistaVentas)

router.get('/cali/ventasProductos',loginController.autenticado, vistaVentasProductos)

router.get('/cali/reportes',loginController.autenticado, vistaReportes)

router.get('/cali/factura',loginController.autenticado, vistaFactura)

router.get('/cali/facturacion',loginController.autenticado, vistaFacturacion)

router.get('/cali/consultaCedula',loginController.autenticado, vistaConsultaCedula)

router.get('/cali/registros',loginController.autenticado, vistaRegistros)

module.exports = {routes :router}