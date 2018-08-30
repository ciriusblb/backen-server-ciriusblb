const express = require('express');
const mdAutenticacion = require('../middlewares/autenticacion'); 
const app = express();

const Hospital = require('../models/hospital');

app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde); 
    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre  email')
    .exec((err,row)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje:'Error cargando hospitales',
                errors: err
            });
        }
        Hospital.count({},(err,conteo)=>{
            res.status(200).json({
                ok: true,
                hospitales: row,
                total:conteo
            })            
        })
    })
});
app.post('/', mdAutenticacion.verificaToken, (req, res)=>{
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario:req.usuario._id
    });
    
    hospital.save( (err, row) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje:'Error al crear hospitales',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: row
        });
    })
})
app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    var body = req.body;
    Hospital.findById(id, (err,row)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje:'Error al buscar hospital',
                errors: err
            });
        }
        if(!row){
            return res.status(400).json({
                ok: false,
                mensaje:'el hospital no existe',
                errors: err
            });
        }
        row.nombre= body.nombre;
        row.usuario= req.usuario._id;

        row.save( (err, row) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje:'Error al actualizar hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: row
            });
        })
    })

})
app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err,row)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje:'Error al buscar hospital',
                errors: err
            });
        }
        res.status(200).json({
            ok:true,
            hospital:row
        })
    })
})

module.exports =app;