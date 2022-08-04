const db= require('../database/db')

module.exports.registrarproducto = async (req, res) => {
    console.log("===========================")
    console.log(" METODO REGISTRAR PRODUCTO ")
    console.log("===========================")

    const usuario = req.user

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    const txtCedula = req.body.txtCedula
    const txtCodigo = req.body.txtCodigo
    const txtCantidad = req.body.txtCantidad
    var totalfinal = 0
    var totalparcial = 0
    var totaliva = 0   //es el iva del front
    var incrementoiva = 0 //valor del iva de un solo producto
    var totalparcialconiva = 0
    var txtNombre = "CLIENTE NO REGISTRADO"
    var txtNombreProducto = "PRODUCTO NO EXISTE"
    var txtValorProducto = 0
    var txtIVAProducto = 0 //porcentaje del iva 
    var txtConsecutivo = 0 
    var valoriva = 0 //valor iva de un solo producto
    var bandera_producto = 0
    let error_notificaciones = 0
    var ID = 0 
   
    //saca la lista de loc clientes para sacar el nombre
    const clientes = await db.query("SELECT * FROM db_clientes", (error,clientes)=>{
        if(error){
            throw error
        }else{
           return clientes
        }
    })
   
    clientes.forEach( async (cliente) => {
        if (cliente.cedula_clientes == txtCedula)
        {
            txtNombre = cliente.nombre_clientes    
            console.log('txtNombre: ' + txtNombre)   
        }
    })

    const ventas = await db.query("SELECT * FROM db_ventas", (error,ventas)=>{
        if(error){
            throw error
        }else{
           return ventas
        }
    })
        
    //calcula el consecutivo
    ventas.forEach( async (venta) => {
        if (txtConsecutivo < venta.codigo_venta_ventas)
        {
            txtConsecutivo = venta.codigo_venta_ventas       
        }
    })
    txtConsecutivo += 1

    //Saca la lista de los productos para sacar el valor, nombre, IVA
    const productos = await db.query("SELECT * FROM db_productos",(error,productos)=>{
        if(error){
            throw error
        }else{
            return productos
        }
    })
    
    productos.forEach( async (producto) => {
        if (txtCodigo  == producto.codigo_productos)
        {
            bandera_producto = 1
            txtNombreProducto = producto.nombre_productos
            txtValorProducto = producto.precio_venta_productos
            txtIVAProducto = producto.ivacompra_productos
        }
    })

    if(bandera_producto == 1){

        convencion_registros = 2
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario ha REGISTRADO el PRODUCTO con codigo " + req.body.txtCodigo + " con una CANTIDAD de " + req.body.txtCantidad + " en la VENTA con éxito."
                
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })

        error_notificaciones = 2
        totalparcial = txtCantidad * txtValorProducto
        incrementoiva = Math.round(totalparcial * (txtIVAProducto / 100))
        totalparcialconiva = totalparcial + incrementoiva
        valoriva = totalparcialconiva - totalparcial
        totalfinal += totalparcialconiva

        const ventasTemp = await db.query("SELECT * FROM db_ventas_temp",(error,ventasTemp)=>{
            if(error){
                throw error
            }else{
                return ventasTemp
            }
        })

        ID  = 0
        ventasTemp.forEach( async (venta) => {
            if (ID  < venta.ID_temp)
            {
                ID = venta.ID_temp 
            }
        })
        ID += 1
    
        const sql = 'INSERT INTO db_ventas_temp SET ID_temp = ? , codigo_producto_temp = ? , nombre_producto_temp = ? , cantidad_producto_temp = ?, valor_producto_temp = ?, parcial_producto_temp = ?, iva_producto_temp = ?, total_temp = ?'
        await db.query(sql, [ID, txtCodigo, txtNombreProducto, txtCantidad, txtValorProducto, totalparcial, valoriva, totalparcialconiva], (error,res)=>{
            if(error){
                return res.status(500).json({
                message: 'Error al crear la venta temporal'
                })
            } 
        }) 
    }
    else{
        error_notificaciones = 1

        convencion_registros = 3
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario intento REGISTRAR UN PRODUCTO CON CODIGO " + req.body.txtCodigo + " en la VENTA, el cual no existe en la base de datos."
                
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
    }
                       
    totalparcial = 0
    totaliva = 0
    totalfinal = 0
    ventasTemp = await db.query("SELECT * FROM db_ventas_temp",(error,ventasTemp)=>{
        if(error){
            throw error
        }else{
            return ventasTemp
        }
    })

    ventasTemp.forEach(async(ventaTemp) => {
        totalparcial += ventaTemp.parcial_producto_temp
        totaliva += ventaTemp.iva_producto_temp
        totalfinal += ventaTemp.total_temp
    })
    
    return res.render('ventasProductos',{usuario, ventasTemp, txtCedula, txtNombre, totalfinal, txtConsecutivo, totalparcial, totaliva, incrementoiva, totalparcialconiva, error_notificaciones, txtCodigo})   
}

module.exports.registrar = async (req, res)=>{
    console.log("========================")
    console.log(" METODO REGISTRAR VENTA ")
    console.log("========================")

    const usuario = req.user

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    var cedulaUsuario = 0

    var txtConsecutivo = 0
    var totalparcial = 0
    var totaliva = 0
    var totalfinal = 0

    var txtCedula = 0

    var txtNombreCliente = "No Registrado" 
    var txtdireccionCliente = "No Registrado" 
    var txtTelefonoCliente = 0   
    var txtemailCliente = "No Registrado"   
    
    const ventas = await db.query("SELECT * FROM db_ventas", (error,ventas)=>{
        if(error){
            throw error
        }else{
           return ventas
        }
    })
    
    ventas.forEach(async(venta) => {
        if (txtConsecutivo < venta.codigo_venta_ventas )
        {
            txtConsecutivo = venta.codigo_venta_ventas       
        }
    })
    txtConsecutivo += 1
        
    totalparcial = 0
    totaliva = 0
    totalfinal = 0
    ventasTemp = await db.query("SELECT * FROM db_ventas_temp",(error,ventasTemp)=>{
        if(error){
            throw error
        }else{
            return ventasTemp
        }
    })

    ventasTemp.forEach(async(ventaTemp) => {
        codigo_venta_detalle_ventas = txtConsecutivo
        ID_detalle_ventas = ventaTemp.ID_temp
        codigo_producto_detalle_ventas = ventaTemp.codigo_producto_temp
        cantidad_producto_detalle_ventas = ventaTemp.cantidad_producto_temp
        valor_venta_detalle_ventas = ventaTemp.parcial_producto_temp
        valoriva_detalle_ventas = ventaTemp.iva_producto_temp
        valor_total_detalle_ventas = ventaTemp.total_temp

        totalparcial += ventaTemp.parcial_producto_temp
        totaliva += ventaTemp.iva_producto_temp
        totalfinal += ventaTemp.total_temp
        const sql = 'INSERT INTO db_detalle_ventas SET codigo_venta_detalle_ventas = ? , ID_detalle_ventas = ? , codigo_producto_detalle_ventas = ?, cantidad_producto_detalle_ventas = ?, valor_venta_detalle_ventas = ?, valoriva_detalle_ventas = ?, valor_total_detalle_ventas = ?'
        await db.query(sql, [codigo_venta_detalle_ventas, ID_detalle_ventas, codigo_producto_detalle_ventas, cantidad_producto_detalle_ventas, valor_venta_detalle_ventas, valoriva_detalle_ventas,valor_total_detalle_ventas], (error,res)=>{
            if(error){
                return res.status(500).json({
                message: 'Error al crear detalle venta'
                })
            } 
        })

    })
    
    if(totalfinal == 0)
    {
        console.log('VENTA NULA, NO GRABADA')
    }
    else
    {
        const usuarios = await db.query("SELECT * FROM db_usuarios", (error,usuarios)=>{
            if(error){
                throw error
            }else{
               return usuarios
            }
        })
    
        usuarios.forEach( async (usuario) => {  
            if (usuario.usuario_usuarios == usuario2 )
            {
                cedulaUsuario = usuario.cedula_usuarios
            }
        })

        txtCedula = req.body.txtCedula
        const sql = 'INSERT INTO db_ventas SET cedula_cliente_ventas = ? , cedula_usuario_ventas = ?, valor_venta_ventas = ?, ivaventas_ventas = ?, total_venta_ventas = ?, fechahora_ventas = ?'
        await db.query(sql, [txtCedula, cedulaUsuario, totalparcial, totaliva, totalfinal, fechaHoraRegistro], (error,res)=>{
            if(error){
                return res.status(500).json({
                message: 'Error al crear la venta '
                })
            } 
        })
    } 

    const facturas = await db.query("SELECT * FROM db_ventas_temp",(error,facturas)=>{
        if(error){
            throw error
        }else{
            return facturas
        }
    })

    await db.query("DELETE FROM db_ventas_temp",(error)=>{
        if(error){
            throw error
            }
    }) 


    clientes = await db.query("SELECT * FROM db_clientes",(error,clientes)=>{
        if(error){
            throw error
        }else{
            return clientes
        }
    })
                       
    clientes.forEach( async (cliente) => {
        if (cliente.cedula_clientes == txtCedula)
        {
            txtNombreCliente = cliente.nombre_clientes 
            txtdireccionCliente = cliente.direccion_clientes 
            txtTelefonoCliente = cliente.telefono_clientes   
            txtemailCliente = cliente.email_clientes         
        }
    })

    convencion_registros = 2
    fechaHora_registros = fechaHoraRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ha REGISTRADO la venta con CONSECUTIVO numero " + txtConsecutivo + " en el sistema con exito."
                
    const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })
                                         
    res.render('factura',{usuario, txtConsecutivo, txtCedula, txtTelefonoCliente, txtdireccionCliente, txtemailCliente, txtNombreCliente, facturas, totalparcial, totaliva, totalfinal, cedulaUsuario, fechaHoraRegistro})                
}

//eliminar productos
module.exports.eliminar = async (req, res)=>{
    console.log("==========================")
    console.log(" METODO ELIMINAR PRODUCTO ")
    console.log("==========================")
    const usuario = req.user

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    const ID_temp = req.params.codigo_producto_temp
    let error_notificaciones = 0
    let ventasTemp = []

    ventasTemp = await db.query("SELECT * FROM db_ventas_temp",(error,ventasTemp)=>{
        if(error){
            throw error
        }else{
            return ventasTemp
        }
    })
    ventasTemp.forEach(async(venta) => {
        if (venta.ID_temp == ID_temp)
        {
            txtCodigo = venta.codigo_producto_temp
        }
    })
    await db.query("DELETE FROM db_ventas_temp WHERE ID_temp = " + ID_temp,(error)=>{
        if(error){
            throw error
        }
    })
    //esta parte reconstruye la vista despues de haber borrado algun producto de la lista
    const txtCedula = req.body.txtCedula
    var totalfinal = 0
    var totalparcial = 0
    var totaliva = 0   //es el iva del front
    var incrementoiva = 0 //valor del iva de un solo producto
    var totalparcialconiva = 0
    var txtNombre = ""
    var txtConsecutivo = 0 
   
    //saca la lista de loc clientes para sacar el nombre
    const clientes = await db.query("SELECT * FROM db_clientes", (error,clientes)=>{
        if(error){
            throw error
        }else{
           return clientes
        }
    })
   
    clientes.forEach(async(cliente) => {
        if (cliente.cedula_clientes == txtCedula)
        {
            txtNombre = cliente.nombre_clientes     
        }
    })

    const ventas = await db.query("SELECT * FROM db_ventas", (error,ventas)=>{
        if(error){
            throw error
        }else{
           return ventas
        }
    })
        
    //calcula el consecutivo
    ventas.forEach(async(venta) => {
        if (txtConsecutivo < venta.codigo_venta_ventas)
        {
            txtConsecutivo = venta.codigo_venta_ventas       
        }
    })
    txtConsecutivo += 1
                       
    totalparcial = 0
    totaliva = 0
    totalfinal = 0
    ventasTemp = await db.query("SELECT * FROM db_ventas_temp",(error,ventasTemp)=>{
        if(error){
            throw error
        }else{
            return ventasTemp
        }
    })

    ventasTemp.forEach(async(ventaTemp) => {
        totalparcial += ventaTemp.parcial_producto_temp
        totaliva += ventaTemp.iva_producto_temp
        totalfinal += ventaTemp.total_temp
    })
    
    error_notificaciones = 3

    convencion_registros = 2
    fechaHora_registros = fechaHoraRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ha ELIMINADO con exito el producto con ID "+ req.params.codigo_producto_temp +" de la VENTA con consecutivo "+ txtConsecutivo +"."
            
    const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })
   
    return res.render('ventasProductos',{usuario, ventasTemp, txtCedula, txtNombre, totalfinal, txtConsecutivo, totalparcial, totaliva, incrementoiva, totalparcialconiva, error_notificaciones, txtCodigo})   
}

//limpiar ventas temporales
module.exports.nuevaVenta = async(req, res)=>{
    console.log("====================")
    console.log(" METODO NUEVA VENTA ")
    console.log("====================")

    const usuario = req.user

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    convencion_registros = 2
    fechaHora_registros = fechaHoraRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ha CANCELADO la VENTA con exito"
                
    const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })
    
    await db.query("DELETE FROM db_ventas_temp",(error)=>{
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
    res.redirect('/cali/ventas')
}