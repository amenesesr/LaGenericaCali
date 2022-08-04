const db= require('../database/db')
const CookieJWTCali = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const {promisify} = require('util')


module.exports.mostrar = async (req, res) =>{
    const error = 0 
    const usuario = req.usuario
    res.render('login',{error,usuario})
}

module.exports.login = async (req, res)=>{
    try {
        console.log("==============")
        console.log(" METODO LOGIN ")
        console.log("==============")
        const user = req.body.txtUsuario
        const password = req.body.txtPassword
        var error = 1
        var bandera = 0
        var usuario = 0

        var fechaTemp = new Date()
        var fechaHoraRegistro = ""
        options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
        fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

        const usuarios = await db.query("SELECT * FROM db_usuarios", (error,usuarios)=>{
            if(error){
                throw error
            }else{
               return usuarios
            }
        })

        usuarios.forEach( async (usuario) =>  {

            if(usuario.usuario_usuarios == user && bcryptjs.compareSync(password,usuario.password_usuarios))
            {
                bandera = 1
                const id = usuario.usuario_usuarios
                const token = CookieJWTCali.sign({id:id},process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_TIEMPO_EXT
                })
                console.log('Token: ' + token)
                const cookiesOptions = {
                    expiresIn : new Date (Date.now() + process.env.JWT_TIEMPO_EXC * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                res.cookie('CookieJWTCali',token, cookiesOptions)
            } 
        })

        if (bandera != 0)
        {
            convencion_registros = 2
            fechaHora_registros = fechaHoraRegistro
            usuario_registros = usuario
            accion_registros = "El usuario ha iniciado sesion."

            const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
            await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
                if(error){
                    throw error
                }
            })
            res.redirect('/cali/productos')
        }
        else
        {
            convencion_registros = 3
            fechaHora_registros = fechaHoraRegistro
            usuario_registros = usuario
            accion_registros = "El usuario fallo en su intento de inicio de sesion."

            const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
            await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
                if(error){
                    throw error
                }
            })
            usuario = undefined
            error = 1
            res.render('login',{error,usuario}) 
        }
          
    } catch (error) {
        console.log(error)
    }
}


module.exports.autenticado = async (req, res, next) => {
    console.log("====================")
    console.log(" METODO AUTENTICADO ")
    console.log("====================")
    var bandera = 0
    var userval = 0
    if(req.cookies.CookieJWTCali){
        try {
            const decodificada = await promisify(CookieJWTCali.verify)(req.cookies.CookieJWTCali, process.env.JWT_SECRET)

            const usuarios = await db.query("SELECT * FROM db_usuarios", (error,usuarios)=>{
                if(error){
                    throw error
                }else{
                   return usuarios
                }
            })
           
            usuarios.forEach(async (usuario) =>  {
                if(usuario.usuario_usuarios == decodificada.id)
                {
                    bandera = 1
                    userval = usuario
                    //req.user = usuario.usuario_usuarios
                    //return next()
                }
            })
            if (bandera != 0)
            {
                req.user = userval.usuario_usuarios
                return next()
            }
            else
            {
                res.redirect('/cali/login')
            }
        } catch (error) {
            console.log(error)
            return next()
        }
    }
    else
    {
        res.redirect('/cali/login')
    }
}

module.exports.logout = async (req, res) => {
    const usuario = req.user 
    
    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    convencion_registros = 2
    fechaHora_registros = fechaHoraRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ha cerrado sesion."

    const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })

    res.clearCookie('CookieJWTCali')
    return res.redirect('/cali/login')
}
    