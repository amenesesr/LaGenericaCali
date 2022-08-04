const express = require('express')
const router = express.Router()
const multer = require('multer')

const usuariosController = require('../controllers/usuariosController')
const loginController = require('../controllers/loginController')

const { validateCrear } = require ('../validaciones/usuariosCrear')
const { validateModificar } = require ('../validaciones/usuariosModificar')
const { validateEliminar } = require ('../validaciones/usuariosEliminar')

const storage = multer.diskStorage({
    destination:'controllers/archivos/',
    filename:(req,file,cb)=>{
        cb("","usuarios.csv")
    }
})

const cargar = multer({
    storage: storage
})


//mapping crear usuarios
router.post('/cali/usuarios', validateCrear, loginController.autenticado, usuariosController.crear)

//mapping modificar usuarios
router.post('/cali/usuarios/modificar/', validateModificar, loginController.autenticado, usuariosController.modificar)

//mapping eliminar usuarios
router.get('/cali/usuarios/eliminar/:cedula_usuarios', validateEliminar, loginController.autenticado, usuariosController.eliminar)

//mapping cargar archivo usuarios
router.post('/cali/usuarios/cargar/',cargar.single('archivo'), loginController.autenticado, usuariosController.cargar)

//mapping limpiar rechazados
router.get('/cali/usuarios/limpiar/', loginController.autenticado, usuariosController.limpiarRechazados)

module.exports = router
