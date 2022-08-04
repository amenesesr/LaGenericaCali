const path = require('path');
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const dotenv = require('dotenv').config({path: './env/.env'})
const cookieParser = require('cookie-parser')

const app = express()

app.set('views', __dirname + '\\views');
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(express.static(path.join(__dirname,'public')))

app.use(expressLayouts)

app.use(cookieParser())

const router = require('./routes/router')
const { urlencoded } = require('express')
app.use(router.routes)

const usuarios = require('./routes/usuarios')
app.use(usuarios)

const productos = require('./routes/productos')
app.use(productos)

const proveedores = require('./routes/proveedores')
app.use(proveedores)

const clientes = require('./routes/clientes')
app.use(clientes)

const ventas = require('./routes/ventas')
app.use(ventas)

const ventasProductos = require('./routes/ventasProductos')
app.use(ventasProductos)

const factura = require('./routes/factura')
app.use(factura)

const facturacion = require('./routes/facturacion')
app.use(facturacion)

const consultaCedula = require('./routes/consultaCedula')
app.use(consultaCedula)

const registros = require('./routes/registros')
app.use(registros)

const login = require('./routes/login')
app.use(login)

app.get('/cali', (req, res) =>{
    res.send('servidor conectado con exito')
})

app.listen(process.env.PORT, () => {
    console.log('Conectado con exito en http://localhost:' + process.env.PORT + '/cali')
})
