const db= require('../database/db')

module.exports.consultarCedula = async (req, res) => {
    console.log("=========================")
    console.log(" METODO CONSULTAR CEDULA ")
    console.log("=========================")

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)
    
    const txtCedula = req.body.txtCedula
    const usuario = req.user
    let bandera_cliente = 0
    
    
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
           bandera_cliente = 1    
        }
    })

    if (bandera_cliente == 1) {
        convencion_registros = 2
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario CONSULTO LA CEDULA DEL CLIENTE " + req.body.txtCedula + " con éxito para iniciar el proceso de VENTA."
                
        const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
        await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
            if(error){
                throw error
            }
        })
        let txtNombre = ""
        let txtConsecutivo = 0
        let ventasTemp =[]
        let totalparcial = 0
        let totaliva = 0
        let totalfinal = 0
        let error_notificaciones = 0
        return res.render('ventasProductos',{txtCedula, txtNombre, txtConsecutivo, ventasTemp, totalparcial, totaliva, totalfinal, error_notificaciones, usuario})
    } else {
        convencion_registros = 3
        fechaHora_registros = fechaHoraRegistro
        usuario_registros = usuario
        accion_registros = "El usuario CONSULTO LA CEDULA DEL CLIENTE " + req.body.txtCedula + " la cual no existe en la base de datos en el modulo VENTAS."
                
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
        return res.redirect('/cali/ventas')
    }
}