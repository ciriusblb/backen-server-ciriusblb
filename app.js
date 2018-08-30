const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const app = express();

app.use(express.urlencoded({ extended:false}));
app.use(express.json());

// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));


const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const hospitalRoutes= require('./routes/hospital');
const medicoRoutes= require('./routes/medico');
const busquedaRoutes= require('./routes/busqueda');

const loginRoutes = require('./routes/login');
const uploadRoutes= require('./routes/upload');
const imagenesRoutes= require('./routes/imagenes');


mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if(err) throw err;
    console.log("base de datos corriendo");
})
// rutas
app.use('/usuario',usuarioRoutes);
app.use('/hospital',hospitalRoutes);
app.use('/medico',medicoRoutes);

app.use('/login',loginRoutes);
app.use('/busqueda',busquedaRoutes);
app.use('/upload',uploadRoutes);
app.use('/img',imagenesRoutes);

app.use('/',appRoutes);



app.listen(3000, ()=>{
    console.log("servidor escuchando en el puerto 3000");
})