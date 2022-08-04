const db= require('../database/db')

module.exports.consultarConsecutivo = async(req, res)=>{
    console.log("============================")
    console.log(" METODO MOSTRAR FACTURACION ")
    console.log("============================")

    const usuario = req.user

    let fechaHoraRegistro = ""
    let fechaTemp = new Date()
    options = {year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO", options)

    const txtConsecutivo = req.body.txtConsecutivo
    
    var txtCedula = 0
    var totalparcial = 0
    var totaliva = 0
    var totalfinal = 0
    var atendidoPor = ""

    var nombre_producto = ""
    var valor_producto = 0

    var txtNombreCliente = ""
    var txtdireccionCliente = "" 
    var txtTelefonoCliente = 0   
    var txtemailCliente = ""         

    var facturas = []
    var error_notificaciones = 0
    var bandera_consecutivo = 0

    var consultaVentas = []
    
    var tipoConsulta = 1
    var lista = 1
  
    const ventas = await db.query("SELECT * FROM db_ventas", (error,ventas)=>{
        if(error){
            throw error
        }else{
           return ventas
        }
    })

    const detalle_ventas = await db.query("SELECT * FROM db_detalle_ventas", (error,detalle_ventas)=>{
        if(error){
            throw error
        }else{
           return detalle_ventas
        }
    })

    clientes = await db.query("SELECT * FROM db_clientes",(error,clientes)=>{
        if(error){
            throw error
        }else{
            return clientes
        }
    })

    const productos = await db.query("SELECT * FROM db_productos", (error,productos)=>{
        if(error){
            throw error
        }else{
           return productos
        }
    })


    ventas.forEach( async (venta) => {
        
        if (txtConsecutivo == venta.codigo_venta_ventas )
        {
            bandera_consecutivo = 1
            txtCedula = venta.cedula_cliente_ventas
            totalparcial = venta.valor_venta_ventas
            totaliva = venta.ivaventas_ventas
            totalfinal = venta.total_venta_ventas
            atendidoPor = venta.cedula_usuario_ventas
            fecha = venta.fechahora_ventas
        }
    })

    ventas.forEach( async (venta) => {
        if (txtCedula == venta.cedula_cliente_ventas){
            consultaVentas.push(venta)
        }
    })

    detalle_ventas.forEach( async (detalle_venta) => {
        if (txtConsecutivo == detalle_venta.codigo_venta_detalle_ventas )
        {
            productos.forEach( async (producto) => {
                if (detalle_venta.codigo_producto_detalle_ventas == producto.codigo_productos)
                {
                    nombre_producto = producto.nombre_productos
                    valor_producto = producto.precio_compra_productos
                }
            })
            var productoFatura = {
                codigo_producto_detalle_ventas: detalle_venta.codigo_producto_detalle_ventas,
                ID_detalle_ventas : detalle_venta.ID_detalle_ventas,
                nombre_producto,
                cantidad_producto_detalle_ventas: detalle_venta.cantidad_producto_detalle_ventas,
                valor_producto,
                valor_venta_detalle_ventas: detalle_venta.valor_venta_detalle_ventas,
                valoriva_detalle_ventas: detalle_venta.valoriva_detalle_ventas,
                valor_total_detalle_ventas: detalle_venta.valor_total_detalle_ventas
            }
            facturas.push(productoFatura) 
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

    if (bandera_consecutivo == 1) {
        error_notificaciones = 4

        convencion_registros = 2
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario CONSULTO EL CONSECUTIVO NUMERO " + req.body.txtConsecutivo + " con éxito en el modulo CONSULTA DE FACTURAS."
    
        const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })

    } else {
        error_notificaciones = 3

        convencion_registros = 3
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario CONSULTO EL CONSECUTIVO NUMERO " + req.body.txtConsecutivo + " el cual no existe en la base de datos en el modulo CONSULTA DE FACTURAS."
    
        const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
    }

    return res.render('facturacion',{usuario, txtConsecutivo, txtCedula, txtTelefonoCliente, txtdireccionCliente, txtemailCliente, txtNombreCliente, facturas, totalparcial, totaliva, totalfinal, atendidoPor, error_notificaciones, tipoConsulta, lista, consultaVentas})                
}
