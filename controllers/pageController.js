const db = require('../database/db')

const vistaProductos = async (req, res) =>{
    console.log("==========================")
    console.log(" METODO MOSTRAR PRODUCTOS ")
    console.log("==========================")

    const usuario = req.user
    let error = 0
    let notificaciones = []

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    convencion_registros = 1
    fechaHora_registros = fechaHoraRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ingreso al modulo PRODUCTOS"

    const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })

    const productos = await db.query("SELECT * FROM db_productos",(error,productos)=>{
        if(error){
            throw error
        }else{
            return productos
        }
    })
    const productosRechazados = await db.query("SELECT * FROM db_productos_rechazados",(error,productosRechazados)=>{
        if(error){
            throw error
        }else{
            return productosRechazados 
        }
    })

    const cargues = await db.query("SELECT * FROM db_cargues",(error,cargues)=>{
        if(error){
            throw error
        }else{
            return cargues
        }
    }) 
    
    notificaciones = await db.query("SELECT * FROM db_notificaciones",(error,notificaciones)=>{
        if(error){
            throw error
        }else{
            return notificaciones
        }
    })

    if (notificaciones.length == 0) {
        prueba = await db.query('INSERT INTO db_notificaciones SET error_notificaciones = 0', (error,res)=>{
            if(error){
                throw error
            }
        })
        notificaciones = await db.query("SELECT * FROM db_notificaciones",(error,notificaciones)=>{
            if(error){
                throw error
            }else{
                return notificaciones
            }
        })
    }
    
    const limpiar_notificaciones = await db.query("DELETE FROM db_notificaciones",(error,limpiar_notificaciones)=>{
        if(error){
            throw error
        }else{
            return limpiar_notificaciones
        }
    })

    const limpiar_cargues = await db.query("DELETE FROM db_cargues",(error,limpiar_cargues)=>{
        if(error){
            throw error
        }else{
            return limpiar_cargues
        }
    })   
    //console.log("cargues "+ JSON.stringify(cargues))
    res.render('productos',{productos, productosRechazados, notificaciones, cargues, usuario, error})
}

const vistaProveedores = async (req, res) =>{
    console.log("============================")
    console.log(" METODO MOSTRAR PROVEEDORES ")
    console.log("============================")

    const usuario = req.user
    error = 0

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    convencion_registros = 1
    fechaHora_registros = fechaHoraRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ingreso al modulo PROVEEDORES"

    const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })

    const proveedores = await db.query("SELECT * FROM db_proveedores",(error,proveedores)=>{
        if(error){
            throw error
        }else{
            return proveedores
        }
    })
    const proveedoresRechazados = await db.query("SELECT * FROM db_proveedores_rechazados",(error,proveedoresRechazados)=>{
        if(error){
            throw error
        }else{
            return proveedoresRechazados 
        }
    })

    const cargues = await db.query("SELECT * FROM db_cargues",(error,cargues)=>{
        if(error){
            throw error
        }else{
            return cargues
        }
    }) 

    notificaciones = await db.query("SELECT * FROM db_notificaciones",(error,notificaciones)=>{
        if(error){
            throw error
        }else{
            return notificaciones
        }
    })

    if (notificaciones.length == 0) {
        prueba = await db.query('INSERT INTO db_notificaciones SET error_notificaciones = 0', (error,res)=>{
            if(error){
                throw error
            }
        })
        notificaciones = await db.query("SELECT * FROM db_notificaciones",(error,notificaciones)=>{
            if(error){
                throw error
            }else{
                return notificaciones
            }
        })
    }

    const limpiar_cargues = await db.query("DELETE FROM db_cargues",(error,limpiar_cargues)=>{
        if(error){
            throw error
        }else{
            return limpiar_cargues
        }
    })   
    
    const limpiar_notificaciones = await db.query("DELETE FROM db_notificaciones",(error,limpiar_notificaciones)=>{
        if(error){
            throw error
        }else{
            return limpiar_notificaciones
        }
    })

    res.render('proveedores',{proveedores, proveedoresRechazados, notificaciones, cargues, usuario, error})
}

const vistaUsuarios = async (req, res) =>{
    console.log("=========================")
    console.log(" METODO MOSTRAR USUARIOS ")
    console.log("=========================")

    const usuario = req.user
    const error = 0

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    convencion_registros = 1
    fechaHora_registros = fechaHoraRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ingreso al modulo USUARIOS"

    const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })

    const usuarios = await db.query("SELECT * FROM db_usuarios", (error,usuarios)=>{
        if(error){
            throw error
        }else{
           return usuarios
        }
    })
    const usuariosRechazados = await db.query("SELECT * FROM db_usuarios_rechazados",(error,usuariosRechazados)=>{
        if(error){
            throw error
        }else{
            return usuariosRechazados 
        }
    })
    const cargues = await db.query("SELECT * FROM db_cargues",(error,cargues)=>{
        if(error){
            throw error
        }else{
            return cargues
        }
    }) 
    
    notificaciones = await db.query("SELECT * FROM db_notificaciones",(error,notificaciones)=>{
        if(error){
            throw error
        }else{
            return notificaciones
        }
    })

    if (notificaciones.length == 0) {
        prueba = await db.query('INSERT INTO db_notificaciones SET error_notificaciones = 0', (error,res)=>{
            if(error){
                throw error
            }
        })
        notificaciones = await db.query("SELECT * FROM db_notificaciones",(error,notificaciones)=>{
            if(error){
                throw error
            }else{
                return notificaciones
            }
        })
    }
    
    const limpiar_notificaciones = await db.query("DELETE FROM db_notificaciones",(error,limpiar_notificaciones)=>{
        if(error){
            throw error
        }else{
            return limpiar_notificaciones
        }
    })

    const limpiar_cargues = await db.query("DELETE FROM db_cargues",(error,limpiar_cargues)=>{
        if(error){
            throw error
        }else{
            return limpiar_cargues
        }
    })
    res.render('usuarios',{usuarios,usuariosRechazados, notificaciones, cargues, usuario, error})
}

const vistaClientes = async (req, res) =>{
    console.log("=========================")
    console.log(" METODO MOSTRAR CLIENTES ")
    console.log("=========================")

    const usuario = req.user
    const error = 0

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    convencion_registros = 1
    fechaHora_registros = fechaHoraRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ingreso al modulo CLIENTES"

    const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })

    const clientes = await db.query("SELECT * FROM db_clientes", (error,clientes)=>{
        if(error){
            throw error
        }else{
           return clientes
        }
    })
    const clientesRechazados = await db.query("SELECT * FROM db_clientes_rechazados", (error,clientesRechazados)=>{
        if(error){
            throw error
        }else{
           return clientesRechazados
        }
    })
    const cargues = await db.query("SELECT * FROM db_cargues",(error,cargues)=>{
        if(error){
            throw error
        }else{
            return cargues
        }
    }) 
    
    notificaciones = await db.query("SELECT * FROM db_notificaciones",(error,notificaciones)=>{
        if(error){
            throw error
        }else{
            return notificaciones
        }
    })

    if (notificaciones.length == 0) {
        prueba = await db.query('INSERT INTO db_notificaciones SET error_notificaciones = 0', (error,res)=>{
            if(error){
                throw error
            }
        })
        notificaciones = await db.query("SELECT * FROM db_notificaciones",(error,notificaciones)=>{
            if(error){
                throw error
            }else{
                return notificaciones
            }
        })
    }
    
    const limpiar_notificaciones = await db.query("DELETE FROM db_notificaciones",(error,limpiar_notificaciones)=>{
        if(error){
            throw error
        }else{
            return limpiar_notificaciones
        }
    })

    const limpiar_cargues = await db.query("DELETE FROM db_cargues",(error,limpiar_cargues)=>{
        if(error){
            throw error
        }else{
            return limpiar_cargues
        }
    })
    res.render('clientes',{clientes, clientesRechazados, usuario, notificaciones, cargues, error})
}

const vistaVentas = async (req, res) =>{
    console.log("======================")
    console.log(" METODO CARGAR VENTAS ")
    console.log("======================")
    
    usuario = req.user

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    convencion_registros = 1
    fechaHora_registros = fechaHoraRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ingreso al modulo VENTAS"

    const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })

    notificaciones = await db.query("SELECT * FROM db_notificaciones",(error,notificaciones)=>{
        if(error){
            throw error
        }else{
            return notificaciones
        }
    })

    if (notificaciones.length == 0) {
        prueba = await db.query('INSERT INTO db_notificaciones SET error_notificaciones = 0', (error,res)=>{
            if(error){
                throw error
            }
        })
        notificaciones = await db.query("SELECT * FROM db_notificaciones",(error,notificaciones)=>{
            if(error){
                throw error
            }else{
                return notificaciones
            }
        })
    }
    
    const limpiar_notificaciones = await db.query("DELETE FROM db_notificaciones",(error,limpiar_notificaciones)=>{
        if(error){
            throw error
        }else{
            return limpiar_notificaciones
        }
    })

    res.render('ventas',{notificaciones, usuario})
}


const vistaVentasProductos = async (req, res) =>{
    console.log("======================")
    console.log(" METODO CARGAR VENTAS ")
    console.log("======================")
    usuario = req.user
    const txtCedula = ""
    var totalfinal = 0
    var totalparcial = 0
    var totaliva = 0
    var totalparcial = 0
    var txtNombre = ""
    var txtConsecutivo = 0
    var incrementoiva = 0
    var totalparcialconiva = 0

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    convencion_registros = 1
    fechaHora_registros = fechaHoraRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ingreso al modulo VENTAPRODUCTOS****"

    const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })
   
    const ventas = await db.query("SELECT * FROM db_ventas", (error,ventas)=>{
        if(error){
            throw error
        }else{
           return ventas
        }
    })

    ventas.forEach((venta) => {
        if (txtConsecutivo < venta.codigo_venta_ventas)
        {
            txtConsecutivo = venta.codigo_venta_ventas       
        }
    })
    txtConsecutivo += 1
    
    const ventasTemp = await db.query("SELECT * FROM db_ventas_temp", (error,ventasTemp)=>{
        if(error){
            throw error
        }else{
           return ventasTemp
        }
    })
    res.render('ventasProductos',{ventasTemp, txtCedula, txtNombre, totalfinal, txtConsecutivo, totalparcial, totaliva, incrementoiva, totalparcialconiva, usuario})
}

const vistaReportes = async (req, res) =>{
    console.log("========================")
    console.log(" METODO CARGAR REPORTES ")
    console.log("========================")
    const usuario = req.user

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    convencion_registros = 1
    fechaHora_registros = fechaHoraRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ingreso al modulo REPORTES"

    const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })
    
    const clientes = await db.query("SELECT * FROM db_clientes", (error,clientes)=>{
        if(error){
            throw error
        }else{
           return clientes
        }
    })
    const ventas = await db.query("SELECT * FROM db_ventas", (error,ventas)=>{
        if(error){
            throw error
        }else{
           return ventas
        }
    })
    res.render('reportes', {usuario, clientes, ventas})
}

const vistaFacturacion = async(req, res)=>{
    console.log("===========================")
    console.log(" METODO CARGAR FACTURACION ")
    console.log("===========================")
    const usuario = req.user
    const txtConsecutivo = 0
    const ventasTemp = []
    const txtCedula = 0 
    const txtNombre = ""
    const totalfinal = 0 
    const totalparcial = 0
    const totaliva = 0
    const incrementoiva = 0
    const totalparcialconiva = 0
    const txtTelefonoCliente = 0
    const txtdireccionCliente = ""
    const txtemailCliente = ""
    const txtNombreCliente = ""
    const atendidoPor = 0
    const facturas = []
    const fecha = ""
    const error_notificaciones = 0
    const lista = 0
    const consultaVentas = []

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    convencion_registros = 1
    fechaHora_registros = fechaHoraRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ingreso al modulo FACTURACION"

    const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })
    
    return res.render('facturacion',{ventasTemp, txtCedula, txtNombre, totalfinal, txtConsecutivo, totalparcial, totaliva, incrementoiva, totalparcialconiva, txtTelefonoCliente, txtdireccionCliente, txtemailCliente, txtNombreCliente, facturas, usuario, atendidoPor, fecha, error_notificaciones, lista, consultaVentas})
}

const vistaConsultaCedula = async(req, res)=>{
    console.log("==============================")
    console.log(" METODO CARGAR CONSULTACEDULA ")
    console.log("==============================")
    const usuario = req.user
    const txtConsecutivo = 0
    const ventasTemp = []
    const txtCedula = 0 
    const txtNombre = ""
    const totalfinal = 0 
    const totalparcial = 0
    const totaliva = 0
    const incrementoiva = 0
    const totalparcialconiva = 0
    const txtTelefonoCliente = 0
    const txtdireccionCliente = ""
    const txtemailCliente = ""
    const txtNombreCliente = ""
    const atendidoPor = 0
    const facturas = []
    const consultaVentas = []
    const fecha = ""
    const error_notificaciones = 0
    const lista = 0

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    convencion_registros = 1
    fechaHora_registros = fechaHoraRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ingreso al modulo CONSULTARCEDULA***"

    const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })
    
    return res.render('consultaCedula',{ventasTemp, txtCedula, txtNombre, totalfinal, txtConsecutivo, totalparcial, totaliva, incrementoiva, totalparcialconiva, txtTelefonoCliente, txtdireccionCliente, txtemailCliente, txtNombreCliente, facturas, usuario, atendidoPor, fecha, error_notificaciones, lista, consultaVentas})
}

const vistaFactura = async(req, res)=>{
    console.log("=======================")
    console.log(" METODO CARGAR FACTURA ")
    console.log("=======================")
    const usuario = req.user
    const txtConsecutivo = 0
    const ventasTemp = []
    const txtCedula = 0 
    const txtNombre = ""
    const totalfinal = 0 
    const totalparcial = 0
    const totaliva = 0
    const incrementoiva = 0
    const totalparcialconiva = 0
    const txtTelefonoCliente = 0
    const txtdireccionCliente = ""
    const txtemailCliente = ""
    const txtNombreCliente = ""
    const atendidoPor = 0
    const facturas = []
    const fecha = ""
    const cedulaUsuario = 0

    var fechaTemp = new Date()
    var fecharRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fecharRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    convencion_registros = 1
    fechaHora_registros = fecharRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ingreso al modulo FACTURA***"

    const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })
    
    return res.render('factura',{ventasTemp, txtCedula, txtNombre, totalfinal, txtConsecutivo, totalparcial, totaliva, incrementoiva, totalparcialconiva, txtTelefonoCliente, txtdireccionCliente, txtemailCliente, txtNombreCliente, facturas, usuario, atendidoPor, fecha, cedulaUsuario})
}

const vistaRegistros = async (req, res) =>{
    console.log("==========================")
    console.log(" METODO MOSTRAR REGISTROS ")
    console.log("==========================")

    const usuario = req.user

    let contadorInformativo = 0
    let contadorExitoso = 0
    let contadorFallido = 0 

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    convencion_registros = 1
    fechaHora_registros = fechaHoraRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ingreso al modulo REGISTROS"

    const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })

    const registros = await db.query("SELECT * FROM db_registros",(error,registros)=>{
        if(error){
            throw error
        }else{
            return registros
        }
    })

    registros.forEach((registro) => {
        if (registro.convencion_registros == 1)
        {
            contadorInformativo += 1
        }
        if (registro.convencion_registros == 2)
        {
            contadorExitoso += 1
        }
        if (registro.convencion_registros == 3)
        {
            contadorFallido += 1
        }
    })
    
    //console.log("cargues "+ JSON.stringify(cargues))
    res.render('registros',{registros, contadorInformativo, contadorExitoso, contadorFallido, usuario})
}

module.exports = {
    vistaProductos,
    vistaProveedores,
    vistaUsuarios,
    vistaClientes,
    vistaVentas,
    vistaVentasProductos,
    vistaReportes,
    vistaFactura,
    vistaFacturacion,
    vistaConsultaCedula,
    vistaRegistros
}