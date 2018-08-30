const express = require('express');
const mdAutenticacion = require('../middlewares/autenticacion'); 
const app = express();

const Medico = require('../models/medico');

app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Medico.find({},(err,row)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje:'Error cargando medicos',
                errors: err
            });
        }
        Medico.count({},(err,conteo)=>{
            res.status(200).json({
                ok: true,
                medicos: row,
                total:conteo
            })
        })

    }).populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(5);
});
app.post('/', mdAutenticacion.verificaToken, (req, res)=>{
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario:req.usuario._id,
        hospital:body.hospital
    });
    
    medico.save( (err, row) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje:'Error al crear medicos',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: row
        });
    })
})
app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    var body = req.body;
    Medico.findById(id, (err,row)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje:'Error al buscar medicos',
                errors: err
            });
        }
        if(!row){
            return res.status(400).json({
                ok: false,
                mensaje:'el medico no existe',
                errors: err
            });
        }
        row.nombre= body.nombre;
        row.usuario= req.usuario._id;
        row.hospital= body.hospital;

        row.save( (err, row) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje:'Error al actualizar medico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: row
            });
        })
    })

})
app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err,row)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje:'Error al buscar medico',
                errors: err
            });
        }
        res.status(200).json({
            ok:true,
            medico:row
        })
    })
})

module.exports =app;