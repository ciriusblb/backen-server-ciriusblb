const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.urlencoded({ extended:false}));
app.use(express.json());

const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes = require('./routes/login');






mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if(err) throw err;
    console.log("base de datos corriendo");
})
// rutas
app.use('/usuario',usuarioRoutes);
app.use('/login',loginRoutes);
app.use('/',appRoutes);



app.listen(3000, ()=>{
    console.log("servidor escuchando en el puerto 3000");
})