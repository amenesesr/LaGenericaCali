const db= require('../database/db')
const csvtojson = require('csvtojson')

//crear clientes
module.exports.crear = async (req, res)=>{
    console.log("=======================")
    console.log(" METODO CREAR CLIENTES ")
    console.log("=======================")

    const usuario = req.user 

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    const cedula = req.body.txtCedula
    const nombre = req.body.txtNombre
    const correo = req.body.txtCorreo
    const direccion = req.body.txtDireccion
    const telefono = req.body.txtTelefono

    var clientesExistentes = []
    var bandera_cliente = 0
    var errorRechazado = ""

    var error = 0

    clientesExistentes = await db.query("SELECT * FROM db_clientes",(error,clientes)=>{
        if(error){
            throw error
        }else{
            return clientes
        }
    })

    bandera_cliente = 0
    clientesExistentes.forEach((clienteExistente)=>{
        if(cedula == clienteExistente.cedula_clientes){
            bandera_cliente  = 1
        }
    })

    if (bandera_cliente == 0)
    {
        convencion_registros = 2
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario CREO el CLIENTE INDIVIDUAL con cedula " + req.body.txtCedula + " con éxito."
            
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
        error = 2
        const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
        await db.query(sql_notificacion, [error], (error,res)=>{
            if(error){
                throw error
            }
        })
        const sql = 'INSERT INTO db_clientes SET cedula_clientes = ? , direccion_clientes = ? , email_clientes = ?, nombre_clientes = ?, telefono_clientes = ?'
        await db.query(sql, [cedula, direccion , correo, nombre, telefono], (error,res)=>{
            if(error){
                return res.status(500).json({
                message: 'Error al crear el cliente'
                })
            } 
        }) 
    }
    else
    {
        convencion_registros = 3
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario fallo en el intento de CREAR EL CLIENTE INDIVIDUAL con cedula " + req.body.txtCedula + "."
                
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
        error = 1
        const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
        await db.query(sql_notificacion, [error], (error,res)=>{
            if(error){
                throw error
            }
        })

        errorRechazado = "El cliente con cedula '" + cedula + "' ya existe" 
        const sql = 'INSERT INTO db_clientes_rechazados SET cedula_clientes_rechazados = ?, nombre_clientes_rechazados = ?, error_clientes_rechazados = ?, fecha_clientes_rechazados = ?'
        await db.query(sql, [cedula, nombre, errorRechazado, fechaHoraRegistro], (error,res)=>{
            if(error){
                return res.status(500).json({
                    message: 'Error al crear el cliente'
                })
            } 
        })  
    }
    
    res.redirect('/cali/clientes')
}

//modificar clientes
module.exports.modificar = async (req, res)=>{
    try {
        console.log("===========================")
        console.log(" METODO MODIFICAR CLIENTES ")
        console.log("===========================")

        const usuario = req.user 

        var fechaTemp = new Date()
        var fechaHoraRegistro = ""
        options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
        fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)
        
        const cedula = req.body.txtCedula_editar
        const nombre = req.body.txtNombre_editar
        const telefono = req.body.txtTelefono_editar
        const correo = req.body.txtCorreo_editar
        const direccion = req.body.txtDireccion_editar    
        
        var error = 0

        convencion_registros = 2
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario MODIFICO el CLIENTE con cedula " + req.body.txtCedula_editar + " con éxito."
            
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
        
        const sql = "UPDATE db_clientes SET direccion_clientes = ?, email_clientes = ?, nombre_clientes = ?, telefono_clientes = ? WHERE cedula_clientes = ?"
        await db.query(sql, [direccion, correo, nombre, telefono, cedula] , (error,res)=>{
            if(error){
                return res.status(500).json({
                    message: 'Error al modificar el clientes'
                })
            } 
        }) 
        
        error = 6
        const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
        await db.query(sql_notificacion, [error], (error,res)=>{
            if(error){
                throw error
            }
        })
        
        res.redirect('/cali/clientes')
        
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
    var direccion = ""
    var telefono = 0
 
    var errorRechazado = ""

    var registros_totales = 0
    var registros_aceptados = 0
    var registros_rechazados = 0

    var error = 0

    const archivo = __dirname + "\\archivos\\clientes.csv"
    console.log(archivo)

    var clientesAceptados = []
    var clientesRechazados = []
    var clientesExistentes = []

    clientesExistentes = await db.query("SELECT * FROM db_clientes",(error,clientes)=>{
        if(error){
            throw error
        }else{
            return clientes
        }
    })
    
    csvtojson().fromFile(archivo).then(async source => {

        for (var i = 0; i < source.length; i++) 
        {
            var oneRow = {
                cedula_clientes: source[i]['cedula_clientes'],
                direccion_clientes: source[i]['direccion_clientes'],
                email_clientes: source[i]['email_clientes'],
                nombre_clientes: source[i]['nombre_clientes'],
                telefono_clientes: source[i]['telefono_clientes']
            }
            
            bandera_cliente = 0
            clientesExistentes.forEach((clienteExistente) => {
                if (oneRow.cedula_clientes == clienteExistente.cedula_clientes )
                {
                    errorRechazado = "El cliente con cedula '"+ oneRow.cedula_clientes + "' ya existe en la base de datos"
                    var clienteRechazado = {
                        cedula_clientes_rechazados: oneRow.cedula_clientes,
                        nombre_clientes_rechazados: oneRow.nombre_clientes,
                        error_clientes_rechazados: errorRechazado
                    }
                    bandera_cliente = 1
                    clientesRechazados.push(clienteRechazado) 
                }
            })

            if (bandera_cliente == 0)
            {
                clientesAceptados.push(oneRow);
            }
            registros_totales++
        } //aqui termina la verificacion de los datos del archivo CSV para empezar a grabar

        clientesAceptados.forEach( async (clienteAceptado)  =>  {
            cedula = clienteAceptado.cedula_clientes
            nombre = clienteAceptado.nombre_clientes
            correo = clienteAceptado.email_clientes
            direccion = clienteAceptado.direccion_clientes
            telefono = clienteAceptado.telefono_clientes
            sql = 'INSERT INTO db_clientes SET cedula_clientes = ? , direccion_clientes = ? , email_clientes = ?, nombre_clientes = ?, telefono_clientes = ?'
            await db.query(sql, [cedula, direccion , correo, nombre, telefono], (error,res)=>{
                if(error){
                    return res.status(500).json({
                    message: 'Error al crear el cliente'
                    })
                } 
            }) 
            registros_aceptados++
        })

        clientesRechazados.forEach(async (clienteRechazado)  =>  {
            cedula = clienteRechazado.cedula_clientes_rechazados
            nombre = clienteRechazado.nombre_clientes_rechazados
            errorRechazado = clienteRechazado.error_clientes_rechazados

            const sql = 'INSERT INTO db_clientes_rechazados SET cedula_clientes_rechazados = ?, nombre_clientes_rechazados = ?, error_clientes_rechazados = ?, fecha_clientes_rechazados = ?'
            await db.query(sql, [cedula, nombre, errorRechazado, fechaHoraRegistro], (error,res)=>{
                if(error){
                    return res.status(500).json({
                        message: 'Error al crear el cliente'
                    })
                } 
            })
            registros_rechazados++   
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
            accion_registros = "El usuario fallo en el intento de CARGAR UN ARCHIVO CSV en el modulo CLIENTES"
                
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
            return res.redirect('/cali/clientes')
        }

        if (registros_aceptados == registros_totales)
        {
            convencion_registros = 2
            fechaHora_registros = fechaHoraRegistro
            usuario_registros = usuario
            accion_registros = "El usuario cargo con exito un archivo CSV en el modulo CLIENTES."
                
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
            return res.redirect('/cali/clientes')
        }
        if (registros_aceptados != registros_totales)
        {
            convencion_registros = 3
            fechaHora_registros = fechaHoraRegistro
            usuario_registros = usuario
            accion_registros = "El usuario intento CARGAR UN ARCHIVO CSV en el modulo CLIENTES con algunos errores."
                
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
            return res.redirect('/cali/clientes')
        }
    })
} 

//eliminar clientes
module.exports.eliminar = async (req, res) => {
    console.log("==========================")
    console.log(" METODO ELIMINAR CLIENTES ")
    console.log("==========================")
    const usuario = req.user 

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    const cedula_clientes = req.params.cedula_clientes
    var ventas = []
    bandera_clientes = 0

    var error = 0

    ventas = await db.query("SELECT * FROM db_ventas",(error,clientes)=>{
        if(error){
            throw error
        }else{
            return clientes
        }
    })

    ventas.forEach(async (venta) => {
        if (cedula_clientes == venta.cedula_cliente_ventas)
        {
            bandera_clientes = 1
        }
    })

    if(bandera_clientes == 0){
        convencion_registros = 2
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario ELIMINO el CLIENTE con cedula " + req.params.cedula_clientes + " con éxito."
            
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
        await db.query("DELETE FROM db_clientes WHERE cedula_clientes = " + cedula_clientes,(error,clientes)=>{
            if(error){
                throw error
            }
        })
    }
    else
    {
        convencion_registros = 3
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario fallo en el intento de ELIMINAR el CLIENTE con cedula " + req.params.cedula_clientes + "."
            
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
        error = 7
        const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
        await db.query(sql_notificacion, [error], (error,res)=>{
            if(error){
                throw error
            }
        })
    }   
    res.redirect('/cali/clientes')
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
    accion_registros = "El usuario ha limpiado la tabla de CLIENTES RECHAZADOS del modulo CLIENTES"
            
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
    
    await db.query("DELETE FROM db_clientes_rechazados",(error)=>{
        if(error){
            throw error
        }
    })
    res.redirect('/cali/clientes')
}