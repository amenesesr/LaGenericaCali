const express = require('express')
const router = express.Router()
const multer =require('multer')

const proveedoresController = require('../controllers/proveedoresController')
const loginController = require('../controllers/loginController')

const { validateCrear } = require ('../validaciones/proveedoresCrear')
const { validateModificar } = require ('../validaciones/proveedoresModificar')
const { validateEliminar } = require ('../validaciones/ProveedoresEliminar')

const storage = multer.diskStorage({
    destination:'controllers/archivos/',
    filename:(req,file,cb)=>{
        cb("","proveedores.csv")
    }
})

const cargar = multer({
    storage: storage
})

//mapping crear proveedores
router.post('/cali/proveedores', validateCrear, loginController.autenticado, proveedoresController.crear)

//mapping eliminar proveedores
router.get('/cali/proveedores/eliminar/:nit_proveedores', validateEliminar, loginController.autenticado, proveedoresController.eliminar)

//mapping modificar proveedores
router.post('/cali/proveedores/modificar/', validateModificar, loginController.autenticado, proveedoresController.modificar)

//mapping cargar archivo proveedores
router.post('/cali/proveedores/cargar/',cargar.single('archivo'), loginController.autenticado, proveedoresController.cargar)

//mapping limpiar rechazados
router.get('/cali/proveedores/limpiar/', loginController.autenticado, proveedoresController.limpiarRechazados)

module.exports = router
