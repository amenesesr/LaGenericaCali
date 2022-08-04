const db= require('../database/db')
const csvtojson = require('csvtojson')

//crear Proveedores
module.exports.crear = async (req, res)=>{
    console.log("========================")
    console.log(" METODO CREAR PROVEEDOR ")
    console.log("========================")

    const usuario = req.user 

    const nit = req.body.txtNIT
    const nombre = req.body.txtNombre
    const ciudad = req.body.txtCiudad
    const telefono = req.body.txtTelefono
    const direccion = req.body.txtDireccion
    
    var proveedoresExistentes = []
    var bandera_proveedor = 0
    var error = 0

    //fecha = fechaTemp.toLocaleDateString("es-CO",options)

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)
    
    proveedoresExistentes = await db.query("SELECT * FROM db_proveedores",(error,proveedores)=>{
        if(error){
            throw error
        }else{
            return proveedores
        }
    })

    bandera_proveedor = 0
    proveedoresExistentes.forEach( async (proveedorExistente)=>{
        if(nit == proveedorExistente.nit_proveedores){
            
            error = 1
            const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
            await db.query(sql_notificacion, [error], (error,res)=>{
                if(error){
                    throw error
                }
            })
            bandera_proveedor = 1
            errorRechazado = "El proveedor con nit '"+ nit + "' ya existe en la base de datos" 

            convencion_registros = 3
            fechaHora_registros = fechaHoraRegistro
            usuario_registros = usuario
            accion_registros = "El usuario fallo en el intento de CREAR un PROVEEDOR INDIVIDUAL con NIT " + req.body.txtNIT + "."
        
            const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
            await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
                if(error){
                    throw error
                }
            })
            
            const sql = "INSERT INTO db_proveedores_rechazados SET nitproveedor_proveedores_rechazados = ?, nombre_proveedores_rechazados = ?, error_proveedores_rechazados = ?, fecha_proveedores_rechazados = ?"
            await db.query(sql, [nit, nombre, errorRechazado, fechaHoraRegistro], (error,res)=>{
                if(error){
                    return res.status(500).json({
                        message: 'Error al crear el proveedor'
                    })
                } 
            }) 
        }
    })

    if (bandera_proveedor == 0)
    {
        error = 2
        const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
        await db.query(sql_notificacion, [error], (error,res)=>{
            if(error){
                throw error
            }
        })
        convencion_registros = 2
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario CREO el PROVEEDOR INDIVIDUAL con NIT " + req.body.txtNIT + " con éxito."
    
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
        const sql = "INSERT INTO db_proveedores SET nit_proveedores = ?, nombre_proveedores =? , ciudad_proveedores = ?, direccion_proveedores =?, telefono_proveedores = ?"
        await db.query(sql, [nit, nombre, ciudad, direccion, telefono], (error,res)=>{
            if(error){
                return res.status(500).json({
                    message: 'Error al crear el proveedor'
                })
            } 
        }) 
    }
    res.redirect('/cali/proveedores')
}

//modificar proveedores
module.exports.modificar = async (req, res)=>{
    try {
        console.log("==============================")
        console.log(" METODO MODIFICAR PROVEEDORES ")
        console.log("==============================")

        const usuario = req.user 

        const nit = req.body.txtNIT_editar
        const nombre = req.body.txtNombre_editar
        const ciudad = req.body.txtCiudad_editar
        const direccion = req.body.txtDireccion_editar 
        const telefono = req.body.txtTelefono_editar

        var error = 0

        var fechaTemp = new Date()
        var fechaHoraRegistro = ""
        options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
        fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

        const sql = "UPDATE db_proveedores SET nombre_proveedores = ?, ciudad_proveedores = ?, direccion_proveedores = ?, telefono_proveedores = ? WHERE nit_proveedores = ?"
        await db.query(sql, [nombre, ciudad, direccion, telefono, nit]  ,(error,res)=>{
            if(error){
                return res.status(500).json({
                    message: 'Error al modificar el proveedor'
                })
            } 
        }) 

        convencion_registros = 2
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario MODIFICO el PROVEEDOR con NIT "+ req.body.txtNIT_editar + " con éxito."
    
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
        res.redirect('/cali/proveedores')  
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

    var nit = 0
    var nombre = ""
    var ciudad = ""
    var direccion = ""
    var telefono = 0
 
    var errorRechazado = ""

    var error = 0

    var registros_totales = 0
    var registros_aceptados = 0
    var registros_rechazados = 0

    const archivo = __dirname + "\\archivos\\proveedores.csv"

    var proveedoresAceptados = []
    var proveedoresRechazados = []
    var proveedoresExistentes = []

    proveedoresExistentes = await db.query("SELECT * FROM db_proveedores",(error,proveedores)=>{
        if(error){
            throw error
        }else{
            return proveedores
        }
    })
    
    csvtojson().fromFile(archivo).then(async source => {

        for (var i = 0; i < source.length; i++) 
        {
            var oneRow = {
                nit_proveedores: source[i]['nit_proveedores'],
                nombre_proveedores: source[i]['nombre_proveedores'],
                ciudad_proveedores: source[i]['ciudad_proveedores'],
                direccion_proveedores: source[i]['direccion_proveedores'],
                telefono_proveedores: source[i]['telefono_proveedores']
            }
            
            bandera_proveedor = 0
            proveedoresExistentes.forEach((proveedorExistente) => {
                if (oneRow.nit_proveedores == proveedorExistente.nit_proveedores )
                {
                    var proveedorRechazado = {
                        nitproveedor_proveedores_rechazados: oneRow.nit_proveedores,
                        nombre_proveedores_rechazados: oneRow.nombre_proveedores,
                        error_proveedores_rechazados: errorRechazado = "El proveedor con nit '"+ oneRow.nit_proveedores + "' ya existe en la base de datos"
                    }
                    bandera_proveedor = 1
                    proveedoresRechazados.push(proveedorRechazado) 
                }
            })

            if (bandera_proveedor == 0)
            {
                proveedoresAceptados.push(oneRow);
            }
            registros_totales++
        } //aqui termina la verificacion de los datos del archivo CSV para empezar a grabar

        proveedoresAceptados.forEach( async (proveedorAceptado)  =>  {
            nit = proveedorAceptado.nit_proveedores
            nombre = proveedorAceptado.nombre_proveedores
            ciudad = proveedorAceptado.ciudad_proveedores
            direccion = proveedorAceptado.direccion_proveedores
            telefono = proveedorAceptado.telefono_proveedores         
            const sql = "INSERT INTO db_proveedores SET nit_proveedores = ?, nombre_proveedores =? , ciudad_proveedores = ?, direccion_proveedores =?, telefono_proveedores = ?"
            await db.query(sql, [nit, nombre, ciudad, direccion, telefono], (error,res)=>{
                if(error){
                    return res.status(500).json({
                        message: 'Error al crear el proveedor'
                    })
                } 
            })
            registros_aceptados++
        })

        proveedoresRechazados.forEach( async (proveedorRechazado)  =>  {
            nit = proveedorRechazado.nitproveedor_proveedores_rechazados
            nombre = proveedorRechazado.nombre_proveedores_rechazados
            errorRechazado = proveedorRechazado.error_proveedores_rechazados

            const sql = "INSERT INTO db_proveedores_rechazados SET nitproveedor_proveedores_rechazados = ?, nombre_proveedores_rechazados = ?, error_proveedores_rechazados = ?, fecha_proveedores_rechazados = ?"
            await db.query(sql, [nit, nombre, errorRechazado, fechaHoraRegistro], (error,res)=>{
                if(error){
                    return res.status(500).json({
                        message: 'Error al crear el proveedor'
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
            accion_registros = "El usuario fallo en el intento de CARGAR UN ARCHIVO CSV en el modulo PROVEEDORES"
        
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
            return res.redirect('/cali/proveedores')
        }

        if (registros_aceptados == registros_totales)
        {
            convencion_registros = 2
            fechaHora_registros = fechaHoraRegistro
            usuario_registros = usuario
            accion_registros = "El usuario cargo con exito un archivo CSV en el modulo PROVEEDORES."
        
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
            return res.redirect('/cali/proveedores')
        }
        if (registros_aceptados != registros_totales)
        {
            convencion_registros = 3
            fechaHora_registros = fechaHoraRegistro
            usuario_registros = usuario
            accion_registros = "El usuario intento CARGAR UN ARCHIVO CSV en el modulo PROVEEDORES con algunos errores."
        
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
            return res.redirect('/cali/proveedores')
        }
    })
} 

//eliminar proveedores
module.exports.eliminar = async (req, res)=>{
    console.log("=============================")
    console.log(" METODO ELIMINAR PROVEEDORES ")
    console.log("=============================")
    const usuario = req.user 

    const nit = req.params.nit_proveedores
    var productos = []
    bandera_productos = 0

    var error = 0

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    productos = await db.query("SELECT * FROM db_productos",(error,productos)=>{
        if(error){
            throw error
        }else{
            return productos
        }
    })

    productos.forEach( async (producto) => {
        if (nit == producto.nitproveedor_productos)
        {
            bandera_productos = 1
        }
    })
    
    if(bandera_productos == 0)
    {
        convencion_registros = 2
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario ELIMINO el PROVEEDOR con NIT " + req.params.nit_proveedores + " con éxito."
        
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
        await db.query("DELETE FROM db_proveedores WHERE nit_proveedores = " + nit,(error,proveedores)=>{
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
        accion_registros = "El usuario fallo en el intento de ELIMINAR el PROVEEDOR con NIT " + req.params.nit_proveedores + "."
        
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })

        error = 7
        const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
            db.query(sql_notificacion, [error], (error,res)=>{
                if(error){
                    throw error
                }
            })
    }
    res.redirect('/cali/proveedores')
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
    accion_registros = "El usuario ha limpiado la tabla de PROVEEDORES RECHAZADOS del modulo PROVEEDORES"
        
    const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })
    
    await db.query("DELETE FROM db_proveedores_rechazados",(error)=>{
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

    res.redirect('/cali/proveedores')
}