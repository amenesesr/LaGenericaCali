const db = require('../database/db')

//crear Productos
module.exports.limpiar = async (req, res)=>{
    console.log("===========================")
    console.log(" METODO LIMPIAR REGISTROS ")
    console.log("===========================")
    
    await db.query("DELETE FROM db_registros",(error)=>{
        if(error){
            throw error
        }
    })

    const usuario = req.user 

    var fechaTemp = new Date()
    var fechaHoraRegistro = ""
    options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second:'numeric'}
    fechaHoraRegistro = fechaTemp.toLocaleDateString("es-CO",options)

    convencion_registros = 2
    fechaHora_registros = fechaHoraRegistro
    usuario_registros = usuario
    accion_registros = "El usuario ha limpiado la tabla de REGISTROS del modulo REGISTROS"

    const sql_registro = 'INSERT INTO db_registros SET convencion_registros = ?, fechaHora_registros = ?, usuario_registros = ?, accion_registros = ?'
    await db.query(sql_registro, [convencion_registros, fechaHora_registros, usuario_registros, accion_registros], (error,res)=>{
        if(error){
            throw error
        }
    })
    
    res.redirect('/cali/registros')
}
