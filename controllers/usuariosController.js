const db = require('../database/db')
const csvtojson = require('csvtojson')
const bcryptjs = require('bcryptjs')

//crear usuarios
module.exports.crear = async (req, res)=>{
    console.log("=======================")
    console.log(" METODO CREAR USUARIOS ")
    console.log("=======================")

    const usuario = req.user 

    const cedula = req.body.txtCedula
    const nombre = req.body.txtNombre
    const correo = req.body.txtCorreo
    const usuarioFront = req.body.txtUsuario
    
    const password = await bcryptjs.hash(req.body.txtPassword,10)

    var usuariosExistentes = []
    var bandera_usuario = 0
    var bandera_cedula = 0
    var errorRechazado = ""

    var error = 0

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    usuariosExistentes = await db.query("SELECT * FROM db_usuarios",(error,usuarios)=>{
        if(error){
            throw error
        }else{
            return usuarios
        }
    })

    bandera_usuario = 0
    usuariosExistentes.forEach( async (usuarioExistente)=>{
        if(cedula == usuarioExistente.cedula_usuarios){
            
            error = 1
            const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
            await db.query(sql_notificacion, [error], (error,res)=>{
                if(error){
                    throw error
                }
            })
            bandera_cedula = 1
            errorRechazado = "El usuario con cedula '" + cedula + "' ya existe" 
            
            const sql = 'INSERT INTO db_usuarios_rechazados SET cedula_usuarios_rechazados = ?, nombre_usuarios_rechazados = ?, usuarios_usuarios_rechazados = ?, error_usuarios_rechazados = ?, fecha_usuarios_rechazados = ?'
            await db.query(sql, [cedula, nombre, usuarioFront, errorRechazado, fechaHoraRegistro], (error,res)=>{
                if(error){
                    return res.status(500).json({
                        message: 'Error al crear el usuario'
                    })
                } 
            })  
        }
        if(usuarioFront == usuarioExistente.usuario_usuarios){
            
            error = 2
            const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
            await db.query(sql_notificacion, [error], (error,res)=>{
                if(error){
                    throw error
                }
            })
            bandera_usuario  = 1
            errorRechazado = "Ya existe el usuario '" + usuarioFront + "'" 

            const sql = 'INSERT INTO db_usuarios_rechazados SET cedula_usuarios_rechazados = ?, nombre_usuarios_rechazados = ?, usuarios_usuarios_rechazados = ?, error_usuarios_rechazados = ?, fecha_usuarios_rechazados = ?'
            await db.query(sql, [cedula, nombre, usuarioFront, errorRechazado, fechaHoraRegistro], (error,res)=>{
                if(error){
                    return res.status(500).json({
                        message: 'Error al crear el usuario'
                    })
                } 
            })  
        }
    })

    if (bandera_usuario == 0 && bandera_cedula == 0)
    {
        convencion_registros = 2
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario CREO un USUARIO INDIVIDUAL con cedula " + req.body.txtCedula + " con éxito."
            
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
        error = 3
        const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
        await db.query(sql_notificacion, [error], (error,res)=>{
            if(error){
                throw error
            }
        })
        const sql = 'INSERT INTO db_usuarios SET cedula_usuarios =?, nombre_usuarios =?, email_usuarios =?, usuario_usuarios =?, password_usuarios =?'
        await db.query(sql, [cedula, nombre, correo, usuarioFront, password], (error,res)=>{
            if(error){
                return res.status(500).json({
                    message: 'Error al crear el usuario'
                })
            } 
        }) 
    }
    else
    {
        convencion_registros = 3
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario fallo en el intento de CREAR el USUARIO INDIVIDUAL con cedula " + req.body.txtCedula + "."
            
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
    }
    res.redirect('/cali/usuarios')
}


//modificar usuarios
module.exports.modificar = async (req, res)=>{
    try {
        console.log("===========================")
        console.log(" METODO MODIFICAR USUARIOs ")
        console.log("===========================")
        const usuario = req.user 
        const cedula = req.body.txtCedula_editar
        const nombre = req.body.txtNombre_editar
        const correo = req.body.txtCorreo_editar
        const usuario1 = req.body.txtUsuario_editar 
        const password = await bcryptjs.hash(req.body.txtPassword_editar,10)  
        //const password = req.body.txtPassword_editar
        
        var usuariosExistentes = []
        var bandera_usuario = 0
        var errorRechazado = ""

        var error = 0

        var fechaTemp = new Date()
        var fechaHoraRegistro = ""
        options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
        fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)
        
        usuariosExistentes = await db.query("SELECT * FROM db_usuarios",(error,usuarios)=>{
            if(error){
                throw error
            }else{
                return usuarios
            }
        })
        
        bandera_usuario = 0
        usuariosExistentes.forEach( async (usuarioExistente)=>{
        if(usuario1 == usuarioExistente.usuario_usuarios){
            
            error = 7
            const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
            await db.query(sql_notificacion, [error], (error,res)=>{
                if(error){
                    throw error
                }
            })
            bandera_usuario  = 1
            errorRechazado = "Ya existe el usuario '" + usuario1 + "'" 
            
            const sql = 'INSERT INTO db_usuarios_rechazados SET cedula_usuarios_rechazados = ?, nombre_usuarios_rechazados = ?, usuarios_usuarios_rechazados = ?, error_usuarios_rechazados = ?, fecha_usuarios_rechazados = ?'
            await db.query(sql, [cedula, nombre, usuario1, errorRechazado, fechaHoraRegistro], (error,res)=>{
                if(error){
                    return res.status(500).json({
                        message: 'Error al crear el usuario'
                    })
                } 
            })  
        }
    })  

    if (bandera_usuario == 0)
    {
        convencion_registros = 2
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario MODIFICO el USUARIO con cedula " + req.body.txtCedula_editar + " con éxito."
            
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
        error = 8
        const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
        await db.query(sql_notificacion, [error], (error,res)=>{
            if(error){
                throw error
            }
        })
        const sql = "UPDATE db_usuarios SET nombre_usuarios = ?, email_usuarios = ?, usuario_usuarios = ?, password_usuarios = ? WHERE cedula_usuarios = ?"
        await db.query(sql, [nombre, correo, usuario1, password, cedula]  ,(error,res)=>{
            if(error){
                return res.status(500).json({
                    message: 'Error al modificar el Usuario'
                })
            } 
        })        
    }
    else
    {
        convencion_registros = 3
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario fallo en el intento de MODIFICAR el USUARIO con cedula " + req.body.txtCedula_editar + "."
            
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
    }
    res.redirect('/cali/usuarios')    
    } catch (error) {
      console.log(error)  
    }
}

//cargar archivo
module.exports.cargar = async (req, res)=>{
    console.log("===================")
    console.log(" METODO CARGAR CSV ")
    console.log("===================")

    const usuario = req.user 

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    var cedula = 0
    var nombre = ""
    var correo = ""
    var usuario1 = ""
    var password = ""
 
    var errorRechazado = ""
    var bandera_usuario = 0

    var error = 0

    var registros_totales = 0
    var registros_aceptados = 0
    var registros_rechazados = 0

    const archivo = __dirname + "\\archivos\\usuarios.csv"
    console.log(archivo)

    var usuariosAceptados = []
    var usuariosRechazados = []
    var usuariosExistentes = []

    usuariosExistentes = await db.query("SELECT * FROM db_usuarios",(error,usuarios)=>{
        if(error){
            throw error
        }else{
            return usuarios
        }
    })
    
    csvtojson().fromFile(archivo).then(async source => {

        for (var i = 0; i < source.length; i++) 
        {
            var oneRow = {
                cedula_usuarios: source[i]['cedula_usuarios'],
                nombre_usuarios: source[i]['nombre_usuarios'],
                email_usuarios: source[i]['email_usuarios'],
                usuario_usuarios: source[i]['usuario_usuarios'],
                password_usuarios: source[i]['password_usuarios']
            }
            
            bandera_usuario = 0
            usuariosExistentes.forEach(async(usuarioExistente) => {
                if (oneRow.cedula_usuarios == usuarioExistente.cedula_usuarios)
                {
                    var usuarioRechazado = {
                        cedula_usuarios_rechazados: oneRow.cedula_usuarios,
                        nombre_usuarios_rechazados: oneRow.nombre_usuarios,
                        usuarios_usuarios_rechazados: oneRow.usuario_usuarios,
                        error_usuarios_rechazados: errorRechazado = "El usuario con cedula '" + oneRow.cedula_usuarios + "' ya existe" 
                    }
                    bandera_usuario = 1
                    usuariosRechazados.push(usuarioRechazado) 
                }
            })

            usuariosExistentes.forEach( async (usuarioExistente) => {
                if (oneRow.usuario_usuarios == usuarioExistente.usuario_usuarios)
                {
                    var usuarioRechazado = {
                        cedula_usuarios_rechazados: oneRow.cedula_usuarios,
                        nombre_usuarios_rechazados: oneRow.nombre_usuarios,
                        usuarios_usuarios_rechazados: oneRow.usuario_usuarios,
                        error_usuarios_rechazados: errorRechazado = "Ya existe el usuario '" +oneRow.usuario_usuarios + "'" 
                    }
                    bandera_usuario = 1
                    usuariosRechazados.push(usuarioRechazado) 
                }
            })

            if (bandera_usuario == 0)
            {
                usuariosAceptados.push(oneRow);
            }
            else
            {
                registros_rechazados++ 
            }
            registros_totales++
        } //aqui termina la verificacion de los datos del archivo CSV para empezar a grabar

        usuariosAceptados.forEach( async (usuarioAceptado)  =>  {
            cedula = usuarioAceptado.cedula_usuarios
            nombre = usuarioAceptado.nombre_usuarios
            correo = usuarioAceptado.email_usuarios
            usuario1 = usuarioAceptado.usuario_usuarios
            password = bcryptjs.hashSync(usuarioAceptado.password_usuarios,10)      
            const sql = 'INSERT INTO db_usuarios SET cedula_usuarios =?, nombre_usuarios =?, email_usuarios =?, usuario_usuarios =?, password_usuarios =?'
            await db.query(sql, [cedula, nombre, correo, usuario1, password], (error,res)=>{
                if(error){
                    return res.status(500).json({
                        message: 'Error al crear el usuario'
                    })
                } 
            })
            registros_aceptados++
        })

        usuariosRechazados.forEach( async (usuarioRechazado)  =>  {
            cedula = usuarioRechazado.cedula_usuarios_rechazados
            nombre = usuarioRechazado.nombre_usuarios_rechazados
            usuario1 = usuarioRechazado.usuarios_usuarios_rechazados
            errorRechazado = usuarioRechazado.error_usuarios_rechazados
            
            const sql = 'INSERT INTO db_usuarios_rechazados SET cedula_usuarios_rechazados = ?, nombre_usuarios_rechazados = ?, usuarios_usuarios_rechazados = ?, error_usuarios_rechazados = ?, fecha_usuarios_rechazados = ?'
            await db.query(sql, [cedula, nombre, usuario1, errorRechazado, fechaHoraRegistro], (error,res)=>{
                if(error){
                    return res.status(500).json({
                        message: 'Error al crear el usuario'
                    })
                } 
            })  
        })

        let cargue = "INSERT INTO db_cargues SET aceptados_cargues = ?, rechazados_cargues = ?, total_cargues = ?"
        await db.query(cargue, [registros_aceptados, registros_rechazados, registros_totales], (error,res)=>{
            if(error){
                throw error
            }
        })
    
        if (registros_rechazados == registros_totales)
        {
            convencion_registros = 3
            fechaHora_registros = fechaHoraRegistro
            usuario_registros = usuario
            accion_registros = "El usuario fallo en el intento de CARGAR UN ARCHIVO CSV en el modulo USUARIOS"
                
            const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
            await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
                if(error){
                    throw error
                }
            })
            error = 4
            const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
            await db.query(sql_notificacion, [error], (error,res)=>{
                if(error){
                    throw error
                }
            })
            return res.redirect('/cali/usuarios')
        }

        if (registros_aceptados == registros_totales)
        {
            convencion_registros = 2
            fechaHora_registros = fechaHoraRegistro
            usuario_registros = usuario
            accion_registros = "El usuario cargo con exito un archivo CSV en el modulo USUARIOS"
                
            const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
            await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
                if(error){
                    throw error
                }
            })
            error = 6
            const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
            await db.query(sql_notificacion, [error], (error,res)=>{
                if(error){
                    throw error
                }
            })
            return res.redirect('/cali/usuarios')
        }
        if (registros_aceptados != registros_totales)
        {
            convencion_registros = 3
            fechaHora_registros = fechaHoraRegistro
            usuario_registros = usuario
            accion_registros = "El usuario intento CARGAR UN ARCHIVO CSV en el modulo USUARIOS con algunos errores."
                
            const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
            await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
                if(error){
                    throw error
                }
            })
            error = 5
            const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
            await db.query(sql_notificacion, [error], (error,res)=>{
                if(error){
                    throw error
                }
            })
            return res.redirect('/cali/usuarios')
        }
    })
} 


//eliminar usuarios
module.exports.eliminar = async (req, res)=>{
    console.log("==========================")
    console.log(" METODO ELIMINAR USUARIOS ")
    console.log("==========================")
    const usuario = req.user 

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)
    
    const cedula_usuarios = req.params.cedula_usuarios

    var bandera_usuario = 0

    const ventas = await db.query("SELECT * FROM db_ventas",(error,ventas)=>{
        if(error){
            throw error
        }else{
            return ventas
        }
    })

    ventas.forEach(async(venta)  =>  {
       if (venta.cedula_usuario_ventas == cedula_usuarios){
            bandera_usuario = 1
       }
    })

    if (bandera_usuario == 0) {
        convencion_registros = 2
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario ELIMINO el USUARIO con cedula " + req.params.cedula_usuarios + " con éxito."
            
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
        error = 10
        const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
        await db.query(sql_notificacion, [error], (error,res)=>{
            if(error){
                throw error
            }
        })
        await db.query("DELETE FROM db_usuarios WHERE cedula_usuarios = " + cedula_usuarios,(error,usuarios)=>{
            if(error){
                throw error
            }
        })
    } else {
        convencion_registros = 3
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario fallo en el intento de ELIMINAR el USUARIO con cedula " + req.params.cedula_usuarios +"."
            
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
        error = 9
        const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
        await db.query(sql_notificacion, [error], (error,res)=>{
            if(error){
                throw error
            }
        })
    }
    res.redirect('/cali/usuarios')
}

//limpiar rechazados
module.exports.limpiarRechazados = async (req, res)=>{
    console.log("===========================")
    console.log(" METODO LIMPIAR RECHAZADOS ")
    console.log("===========================")
    const usuario = req.user 

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    convencion_registros = 2
    fechaHora_registros = fechaHoraRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ha limpiado la tabla de USUARIOS RECHAZADOS del modulo USUARIOS"
        
    const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })
    
    await db.query("DELETE FROM db_usuarios_rechazados",(error)=>{
        if(error){
            throw error
        }
    })
    error = 11
    const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
    await db.query(sql_notificacion, [error], (error,res)=>{
        if(error){
            throw error
        }
    })
    res.redirect('/cali/usuarios')
}