const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if(err) throw err;
    console.log("base de datos corriendo");
})
app.listen(3000, ()=>{
    console.log("servidor escuchando en el puerto 3000");
})