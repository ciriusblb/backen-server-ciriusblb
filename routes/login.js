const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

const app = express();

const Usuario = require('../models/usuario');

app.post('/', (req, res) =>{
    var body = req.body;

    Usuario.findOne({email: body.email }, (err, row)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar usuario',
                errors: err,
            });
        }
        if(!row){
            return res.status(400).json({
                ok:false,
                mensaje:'credenciales incorrectas - email',
                errors: err,
            });
        }
        if( !bcrypt.compareSync(body.password, row.password)){
            return res.status(400).json({
                ok:false,
                mensaje:'credenciales incorrectas - password',
                errors: err,
            });
        }
        //crear un token 
        row.password=':)';
        var token = jwt.sign(
            { usuario: row }, 
            SEED,
            {expiresIn: 14400});

        res.status(200).json({
            ok:true,
            usuario: row,
            token: token,
            id: row._id
        });
    })
})

module.exports = app;