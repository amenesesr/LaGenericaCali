const db = require('../database/db')
const csvtojson = require('csvtojson')

//crear Productos
module.exports.crear = async (req, res, next)=>{
    console.log("========================")
    console.log(" METODO CREAR PRODUCTOS ")
    console.log("========================")

    const usuario = req.user 

    const codigo = req.body.txtCodigo
    const nombre = req.body.txtNombre
    const nit = req.body.txtNIT
    const compra = req.body.txtCompra
    const venta = req.body.txtVenta
    const iva = req.body.txtIVA
    var errorRechazado = ""
    var error = 0

    var productosExistentes = []
    var proveedoresExistentes = []

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    productosExistentes = await db.query("SELECT * FROM db_productos",(error,productos)=>{
        if(error){
            throw error
        }else{
            return productos
        }
    })

    proveedoresExistentes = await db.query("SELECT * FROM db_proveedores",(error,proveedores)=>{
        if(error){
            throw error
        }else{
            return proveedores
        }
    })

    bandera_proveedor = 0
    proveedoresExistentes.forEach(async(proveedoresExistente) => {
        if (nit == proveedoresExistente.nit_proveedores )
        {
            bandera_proveedor = 1
        }
    })

    bandera_producto = 0
    productosExistentes.forEach(async(productoExistente)=>{
        if(codigo == productoExistente.codigo_productos){
            
            bandera_producto = 1
            errorRechazado = "Producto con codigo '" + codigo + "' ya existe en la base de datos"

            error = 1
            const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
            await db.query(sql_notificacion, [error], (error,res)=>{
                if(error){
                    throw error
                }
            })
            
            const sql = "INSERT INTO db_productos_rechazados SET codigo_productos_rechazados = ?, nombre_productos_rechazados = ?, nitproveedor_productos_rechazados = ?, error_productos_rechazados = ?, fecha_productos_rechazados = ?"
                await db.query(sql, [codigo, nombre, nit , errorRechazado, fechaHoraRegistro]  ,(error,res)=>{
                if(error){
                    throw error
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
        errorRechazado = "El proveedor con nit '"+ nit + "' no existe en la base de datos"
            
        const sql = "INSERT INTO db_productos_rechazados SET codigo_productos_rechazados = ?, nombre_productos_rechazados = ?, nitproveedor_productos_rechazados = ?, error_productos_rechazados = ?, fecha_productos_rechazados = ?"
        await db.query(sql, [codigo, nombre, nit , errorRechazado, fechaHoraRegistro], (error,res)=>{
            if(error){
                throw error
            }
        })
    }
    
    if (bandera_producto == 0 && bandera_proveedor == 1)
    {       
        error = 3
        const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
        await db.query(sql_notificacion, [error], (error,res)=>{
            if(error){
                throw error
            }
        }) 
        
        convencion_registros = 2
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario CREO el PRODUCTO INDIVIDUAL con codigo " + req.body.txtCodigo + " con éxito. "
    
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })

        const sql = 'INSERT INTO db_productos SET codigo_productos = ?, ivacompra_productos = ?, nitproveedor_productos = ?, nombre_productos = ?, precio_compra_productos = ?, precio_venta_productos = ?'
        await db.query(sql, [codigo, iva, nit, nombre, compra , venta], (error,res)=>{
            if(error){
                throw error
            }
        })
    }
    else{
        convencion_registros = 3
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario fallo en el intento de CREAR el PRODUCTO INDIVIDUAL con codigo " + req.body.txtCodigo + "."
    
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
    }
    res.redirect('/cali/productos')
}

//modificar productos
module.exports.modificar = async (req, res)=>{
    try {
        console.log("============================")
        console.log(" METODO MODIFICAR PRODUCTOS ")
        console.log("============================")
        const usuario = req.user 
        const codigo = req.body.txtCodigo_editar
        const nombre = req.body.txtNombre_editar
        const nit = req.body.txtNIT_editar
        const precioCompra = req.body.txtPrecioCompra_editar  
        const iva = req.body.txtIVA_editar
        const precioVenta = req.body.txtPrecioVenta_editar
        var errorRechazado = ""
        var error = 0

        var proveedoresExistentes = []

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
        proveedoresExistentes.forEach( async (proveedoresExistente) => {
            if (nit == proveedoresExistente.nit_proveedores )
            {
                bandera_proveedor = 1
            }
        })
    
        if (bandera_proveedor == 0)
        {
            convencion_registros = 3
            fechaHora_registros = fechaHoraRegistro
            usuario_registros = usuario
            accion_registros = "El usuario fallo en el intento de MODIFICAR el PRODUCTO con codigo " + req.body.txtCodigo_editar + "."
        
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
            errorRechazado = "El proveedor con nit '"+ nit + "' no existe en la base de datos"        
            const sql = "INSERT INTO db_productos_rechazados SET codigo_productos_rechazados = ?, nombre_productos_rechazados = ?, nitproveedor_productos_rechazados = ?, error_productos_rechazados = ?, fecha_productos_rechazados = ?"
            await db.query(sql, [codigo, nombre, nit , errorRechazado, fechaHoraRegistro]  ,(error,res)=>{
                if(error){
                    throw error
               }
            }) 
        }
    
        if (bandera_proveedor == 1)
        {
            convencion_registros = 2
            fechaHora_registros = fechaHoraRegistro
            usuario_registros = usuario
            accion_registros = "El usuario MODIFICO el PRODUCTO con codigo " + req.body.txtCodigo_editar + " con éxito."
        
            const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
            await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
                if(error){
                    throw error
                }
            })

            const sql = "UPDATE db_productos SET ivacompra_productos = ?, nitproveedor_productos = ?, nombre_productos = ?, precio_compra_productos = ?, precio_venta_productos = ? WHERE codigo_productos = ?"
            await db.query(sql, [iva, nit, nombre, precioCompra, precioVenta, codigo]  ,(error,res)=>{
                if(error){
                    return res.status(500).json({
                        message: 'Error al modificar el producto'
                    })
                } 
            })
            error = 8
            const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
            await db.query(sql_notificacion, [error], (error,res)=>{
                if(error){
                    throw error
                }
            }) 
        }      
        res.redirect('/cali/productos')
    } catch (error) {
      console.log(error)  
    }
}

//eliminar productos
module.exports.eliminar = async (req, res)=>{
    console.log("===========================")
    console.log(" METODO ELIMINAR PRODUCTOS ")
    console.log("===========================")
    const usuario = req.user 
    const codigo_productos = req.params.codigo_productos
    var ventas = []
    var error = 0
    bandera_producto = 0

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)    

    ventas = await db.query("SELECT * FROM db_detalle_ventas",(error,productos)=>{
        if(error){
            throw error
        }else{
            return productos
        }
    })

    ventas.forEach( async (venta) => {
        if (codigo_productos == venta.codigo_producto_detalle_ventas)
        {
            bandera_producto = 1
        }
    })

    if(bandera_producto == 0){
        convencion_registros = 2
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario ELIMINO el PRODUCTO con codigo " + req.params.codigo_productos + " con éxito."
    
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
        await db.query("DELETE FROM db_productos WHERE codigo_productos = " + codigo_productos,(error,productos)=>{
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
        accion_registros = "El usuario fallo en el intento de ELIMINAR el PRODUCTO con codigo " + req.params.codigo_productos + "."
    
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
    res.redirect('/cali/productos')
}

//cargar archivo
module.exports.cargar = async (req, res)=>{
    console.log("===================")
    console.log(" METODO CARGAR CSV ")
    console.log("===================")
    const usuario = req.user 

    var codigo = 0
    var nombre = ""
    var nit = 0
    var compra = 0
    var venta = 0
    var iva = 0

    var errorRechazado = ""
    var error = 0

    var bandera_producto = 0
    const archivo = __dirname + "\\archivos\\productos.csv"
    var productosAceptados = []
    var productosRechazados = []
    var productosExistentes = []
    var proveedoresExistentes = []

    var registros_totales = 0
    var registros_aceptados = 0
    var registros_rechazados = 0

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    productosExistentes = await db.query("SELECT * FROM db_productos",(error,productos)=>{
        if(error){
            throw error
        }else{
            return productos
        }
    })

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
                codigo_productos: source[i]['codigo_productos'],
                ivacompra_productos: source[i]['ivacompra_productos'],
                nitproveedor_productos: source[i]['nitproveedor_productos'],
                nombre_productos: source[i]['nombre_productos'],
                precio_compra_productos: source[i]['precio_compra_productos'],
                precio_venta_productos: source[i]['precio_venta_productos']
            }
            
            bandera_producto = 0
            productosExistentes.forEach( async (productoExistente)=>{
                if(oneRow.codigo_productos == productoExistente.codigo_productos){
                    var productoRechazado = {
                        codigo_productos_rechazados: oneRow.codigo_productos,
                        nombre_productos_rechazados: oneRow.nombre_productos,
                        nitproveedor_productos_rechazados: oneRow.nitproveedor_productos,
                        error_productos_rechazados: "Producto con codigo '" + oneRow.codigo_productos + "' ya existe en la base de datos"     
                    }
                    bandera_producto = 1
                    productosRechazados.push(productoRechazado);
                }
            })

            bandera_proveedor = 0
            proveedoresExistentes.forEach(async (proveedoresExistente) => {
                if (oneRow.nitproveedor_productos == proveedoresExistente.nit_proveedores )
                {
                    bandera_proveedor = 1
                }
            })

            if (bandera_proveedor == 0)
            {
                var productoRechazado = {
                    codigo_productos_rechazados: oneRow.codigo_productos,
                    nombre_productos_rechazados: oneRow.nombre_productos,
                    nitproveedor_productos_rechazados: oneRow.nitproveedor_productos,
                    error_productos_rechazados: "El proveedor con nit '"+ oneRow.nitproveedor_productos + "' no existe en la base de datos" 
                }
                productosRechazados.push(productoRechazado)
            }

            if (bandera_producto == 0 && bandera_proveedor == 1)
            {
                productosAceptados.push(oneRow)
            }
            registros_totales++
        } //aqui termina la verificacion de los datos del archivo CSV para empezar a grabar

        productosAceptados.forEach( async (productoAceptado)  =>  {
            codigo = productoAceptado.codigo_productos
            nombre = productoAceptado.nombre_productos
            nit = productoAceptado.nitproveedor_productos
            compra = productoAceptado.precio_compra_productos
            venta = productoAceptado.precio_venta_productos
            iva = productoAceptado.ivacompra_productos          
            const sql = 'INSERT INTO db_productos SET codigo_productos = ?, ivacompra_productos = ?, nitproveedor_productos = ?, nombre_productos = ?, precio_compra_productos = ?, precio_venta_productos = ?'
            await db.query(sql, [codigo, iva, nit, nombre, compra , venta], (error,res)=>{
                if(error){
                    throw error
                }
            })
            registros_aceptados++
        })

        productosRechazados.forEach( async (productoRechazado)  =>  {
            codigo = productoRechazado.codigo_productos_rechazados
            nombre = productoRechazado.nombre_productos_rechazados
            nit = productoRechazado.nitproveedor_productos_rechazados
            errorRechazado = productoRechazado.error_productos_rechazados
            
            const sql = "INSERT INTO db_productos_rechazados SET codigo_productos_rechazados = ?, nombre_productos_rechazados = ?, nitproveedor_productos_rechazados = ?, error_productos_rechazados = ?, fecha_productos_rechazados = ?"
            await db.query(sql, [codigo, nombre, nit , errorRechazado, fechaHoraRegistro], (error,res)=>{
                if(error){
                    throw error
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
            accion_registros = "El usuario fallo en el intento de CARGAR UN ARCHIVO CSV en el modulo PRODUCTOS"
        
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
            return res.redirect('/cali/productos')
        }

        if (registros_aceptados == registros_totales)
        {
            convencion_registros = 2
            fechaHora_registros = fechaHoraRegistro
            usuario_registros = usuario
            accion_registros = "El usuario cargo con exito un archivo CSV en el modulo PRODUCTOS"
        
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
            return res.redirect('/cali/productos')
        }

        if (registros_aceptados != registros_totales)
        {
            convencion_registros = 3
            fechaHora_registros = fechaHoraRegistro
            usuario_registros = usuario
            accion_registros = "El usuario intento CARGAR UN ARCHIVO CSV en el modulo PRODUCTOS con algunos errores"
        
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
            return res.redirect('/cali/productos')
        }
    })
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
    accion_registros = "El usuario ha limpiado la tabla de PRODUCTOS RECHAZADOS del modulo PRODUCTOS"

    const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })
    
    await db.query("DELETE FROM db_productos_rechazados",(error)=>{
        if(error){
            throw error
        }
    })
    
    error = 12
    const sql_notificacion = 'INSERT INTO db_notificaciones SET error_notificaciones = ?'
    await db.query(sql_notificacion, [error], (error,res)=>{
        if(error){
            throw error
        }
    })
    res.redirect('/cali/productos')
}