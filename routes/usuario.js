const express = require('express');
const bcrypt = require('bcryptjs');
const mdAutenticacion = require('../middlewares/autenticacion'); 
const app = express();

const Usuario = require('../models/usuario');

app.get('/', (req, res) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, row) => {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        mensaje:'Error cargando usuarios',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuarios: row
                });
        })

});
app.post('/', mdAutenticacion.verificaToken, (req, res)=>{
    var body = req.body;
    console.log('body ',body);
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        img: body.img,
        role: body.role
    });
    
    usuario.save( (err, row) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje:'Error al crear usuarios',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: row,
            usuarioToken: req.usuario
        });
    })
})
app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err,row)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje:'Error al buscar usuario',
                errors: err
            });
        }
        if(!row){
            return res.status(400).json({
                ok: false,
                mensaje:'el usuaio no existe',
                errors: err
            });
        }
        row.nombre= body.nombre;
        row.email= body.email;
        row.role= body.role;
        row.save( (err, row) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje:'Error al actualizar usuario',
                    errors: err
                });
            }
            row.password=':)';
            res.status(200).json({
                ok: true,
                usuario: row
            });
        })
    })

})
app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err,row)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje:'Error al buscar usuario',
                errors: err
            });
        }
        res.status(200).json({
            ok:true,
            usuario:row
        })
    })
})

module.exports =app;