const express = require('express')
const router = express.Router()
const multer =require('multer')

const loginController = require('../controllers/loginController')

const { validateCrear } = require ('../validaciones/productosCrear')
const { validateModificar } = require ('../validaciones/productosModificar')
const { validateEliminar } = require ('../validaciones/ProductosEliminar')

const {body, validationResult} = require('express-validator')

const productosController = require('../controllers/productosController')

const storage = multer.diskStorage({
    destination:'controllers/archivos/',
    filename:(req,file,cb)=>{
        cb("","productos.csv")
    }
})

const cargar = multer({
    storage: storage
})

//mapping crear productos
router.post('/cali/productos', validateCrear, loginController.autenticado, productosController.crear)

//mapping modificar productos
router.post('/cali/productos/modificar/', validateModificar, loginController.autenticado, productosController.modificar)

//mapping eliminar productos
router.get('/cali/productos/eliminar/:codigo_productos', validateEliminar, loginController.autenticado, productosController.eliminar)

//mapping limpiar rechazados
router.get('/cali/productos/limpiar/', loginController.autenticado, productosController.limpiarRechazados)

//mapping cargar archivo productos
router.post('/cali/productos/cargar/',cargar.single('archivo'), loginController.autenticado, productosController.cargar)

module.exports = router
