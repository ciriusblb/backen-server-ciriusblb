const express = require('express');

const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');


const app = express();

app.get('/coleccion/:tabla/:busqueda',(req,res)=>{
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');
    var promesa;
    switch(tabla){
        case 'hospitales': 
            promesa = buscarHospitales(regex);    
        break;
        case 'medicos': 
            promesa = buscarMedicos(regex);    
        break;
        case 'usuarios': 
            promesa = buscarUsuarios(regex);    
        break;
        default:
            return res.status(400).json({
                ok:false,
                mensaje:"tabla/collecion no valido"
            });
    }
    promesa.then(data=>{
        res.status(200).json({
            ok:true,
            [tabla]:data
        });
    })
})

app.get('/todo/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    Promise.all([buscarHospitales(regex),buscarMedicos(regex),buscarUsuarios(regex)])
        .then(respuestas=>{
            res.status(200).json({
                ok: true,
                hospitales:respuestas[0],
                medicos:respuestas[1],
                usuarios:respuestas[2],

            }); 
        })
       
});

function buscarHospitales(regex){
    return new Promise((resolve, reject)=>{
        Hospital.find({nombre:regex})
        .populate('usuario', 'nombre  email')
        .exec((err,hospitales)=>{
            if(err){
                reject('error al cargar hospitales', err)
            }else{
                resolve(hospitales);
            }             
        })
    });
}
function buscarMedicos(regex){
    return new Promise((resolve, reject)=>{
        Medico.find({nombre:regex})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err,medicos)=>{
            if(err){
                reject('error al cargar medicos', err)
            }else{
                resolve(medicos);
            }               
        })
    });
}
function buscarUsuarios(regex){
    return new Promise((resolve, reject)=>{
        Usuario.find({},'nombre email role')
            .or([{'nombre':regex},{'email':regex}])
            .exec((err,usuarios)=>{
                if(err){
                    reject('error al cargar usuarios', err)
                }else{
                    resolve(usuarios);
                } 
            })
    });
}
module.exports =app;