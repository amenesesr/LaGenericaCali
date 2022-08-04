const express = require('express')
const router = express.Router()
const multer =require('multer')

const { validateCrear } = require ('../validaciones/clientesCrear')
const { validateModificar } = require ('../validaciones/clientesModificar')
const { validateEliminar } = require ('../validaciones/clientesEliminar')

const clientesController = require('../controllers/clientesController')
const loginController = require('../controllers/loginController')

const storage = multer.diskStorage({
    destination:'controllers/archivos/',
    filename:(req,file,cb)=>{
        cb("","clientes.csv")
    }
})

const cargar = multer({
    storage: storage
})

//mapping crear clientes
router.post('/cali/clientes/crear/', validateCrear, loginController.autenticado, clientesController.crear)

//mapping modificar productos
router.post('/cali/clientes/modificar/', validateModificar, loginController.autenticado, clientesController.modificar)

//mapping eliminar clientes
router.get('/cali/clientes/eliminar/:cedula_clientes', validateEliminar, loginController.autenticado, clientesController.eliminar)

//mapping cargar archivo proveedores
router.post('/cali/clientes/cargar/',cargar.single('archivo'), loginController.autenticado, clientesController.cargar)

//mapping limpiar rechazados
router.get('/cali/clientes/limpiar/', loginController.autenticado, clientesController.limpiarRechazados)

module.exports = router
