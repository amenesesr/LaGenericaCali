const db= require('../database/db')

module.exports.mostrar = async(req, res)=>{
    console.log("========================")
    console.log(" METODO MOSTRAR FACTURA ")
    console.log("========================")

    const usuario = req.user
    const usuario2 = req.body.usuario
    var cedulaUsuario = 0

    var txtConsecutivo = 0
    var totalparcial = 0
    var totaliva = 0
    var totalfinal = 0

    var txtCedula = req.body.txtCedula

    var txtNombreCliente = "No Registrado" 
    var txtdireccionCliente = "No Registrado" 
    var txtTelefonoCliente = 0   
    var txtemailCliente = "No Registrado" 
    var ID_detalle_ventas = 0  
    
    var fechaHoraRegistro = ""
    fechaTemp = new Date()
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    const ventas = await db.query("SELECT * FROM db_ventas", (error,ventas)=>{
        if(error){
            throw error
        }else{
           return ventas
        }
    })
    
    ventas.forEach( async (venta) => {
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

        ventasTemp.forEach( async (ventaTemp) => {
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
        const sql = 'INSERT INTO db_detalle_ventas SET codigo_venta_detalle_ventas = ? , ID_detalle_ventas = ?, codigo_producto_detalle_ventas = ?, cantidad_producto_detalle_ventas = ?, valor_venta_detalle_ventas = ?, valoriva_detalle_ventas = ?, valor_total_detalle_ventas = ?'
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
