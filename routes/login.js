const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

const app = express();

const Usuario = require('../models/usuario');



//google 
const CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

//autenticacion con login
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre:payload.name,
        email:payload.email,
        img:payload.picture,
        google:true
    }
  }

app.post('/google', async (req,res)=>{
    var token = req.body.token;
    var googleUser = await verify(token)
        .catch(e =>{
            res.status(404).json({
                ok:false,
                mensaje:'token no valido'
            });
        })
    Usuario.findOne({email: googleUser.email }, (err, usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar usuario',
                errors: err,
            });
        }
        if(usuarioDB){
            if(usuarioDB.google===false){
                return res.status(400).json({
                    ok:false,
                    mensaje:'use autenticacion normal',
                });
            }else{
                var token = jwt.sign(
                    { usuario: usuarioDB }, 
                    SEED,
                    {expiresIn: 14400});
        
                res.status(200).json({
                    ok:true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            }
        }else{
            // usuario no existe hay que crearlo
            var usuario = new Usuario();
            usuario.nombre=googleUser.nombre;
            usuario.email=googleUser.email;
            usuario.img=googleUser.img;
            usuario.google=true;
            usuario.password=':)';

            usuario.save((err,usuarioDB)=>{
                var token = jwt.sign(
                    { usuario: usuarioDB }, 
                    SEED,
                    {expiresIn: 14400});
        
                res.status(200).json({
                    ok:true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            })

        }
    })
    // res.status(200).json({
    //     ok:true,
    //     googleUser:googleUser
    // });
})


//autenticacion normal
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