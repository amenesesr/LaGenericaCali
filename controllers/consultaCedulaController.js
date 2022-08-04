const db= require('../database/db')

module.exports.mostrar = async(req, res)=>{
    console.log("======================================")
    console.log(" METODO CARGAR PAGINA CONSULTA CEDULA ")
    console.log("======================================")

    const usuario = req.user
    
    var fechaHoraRegistro = ""
    let fechaTemp = new Date()
    options = {year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)
    
    const txtCedula = req.body.txtCedula
    var consultaVentas = []
    var lista = 1
    var error_notificaciones = 0
  
    const ventas = await db.query("SELECT * FROM db_ventas", (error,ventas)=>{
        if(error){
            throw error
        }else{
           return ventas
        }
    })

    ventas.forEach( async (venta) => {
        if (txtCedula == venta.cedula_cliente_ventas){
            consultaVentas.push(venta)
        }
    })

    if (consultaVentas.length == 0){
        error_notificaciones = 1

        convencion_registros = 3
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario CONSULTO LA CEDULA NUMERO " + req.body.txtCedula + " la cual no existe en la base de datos en el modulo CONSULTA DE FACTURAS."
    
        const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
    }
    else{
        error_notificaciones = 2

        convencion_registros = 2
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario CONSULTO LA CEDULA NUMERO " + req.body.txtCedula + " con éxito en el modulo CONSULTA DE FACTURAS."
    
        const sql = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
    }
    return res.render('consultaCedula',{usuario,consultaVentas,txtCedula,lista,error_notificaciones})
}
