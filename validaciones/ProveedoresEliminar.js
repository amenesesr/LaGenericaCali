const {check} = require('express-validator')
const {validateResult} = require('../helpers/validateHelper')

const validateEliminar = [
    check ('nit_proveedores')
        .exists()
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({max:50}),
        (req, res, next) => {
            validateResult(req, res, next)
        }
]

module.exports = {validateEliminar}