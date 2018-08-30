const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

 
// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {
    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje:'ningun archivo seleccionado'
        });
    } 
    var tipo = req.params.tipo;
    var tiposValidos = ['hospitales','medicos','usuarios'];
    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok: false,
            mensaje:'tipo de coleccion no valido',
            errors: {message: "el tipo de coleccion no es valido "}
        });
    }

    var archivo = req.files.imagen;
    var nombre = archivo.name.split('.');
    var extension = nombre[nombre.length-1];
    var extensiones = ["png","jpg","gif","jpeg"];    
    if(extensiones.indexOf(extension)<0){
        return res.status(400).json({
            ok: false,
            mensaje:'extension no valido',
            errors: {message: "las extensiones validas son "+ extensiones.join(', ')}
        });
    }
    var id = req.params.id;
    var nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extension}`;

    var path = `./uploads/${tipo}/${nombreArchivo}`;
   
    archivo.mv( path,err =>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje:'error al mover archivo',
                errors: err
            }); 
        }
        subirPorTipo(tipo, id, nombreArchivo, res)
        // res.status(200).json({
        //     ok: true,
        //     mensaje:'archivo movido',
        //     extension:extension
        // });
    } )
});

function subirPorTipo(tipo, id, nombreArchivo, res){
    if(tipo === 'usuarios'){
        Usuario.findById(id, (err, usuario)=>{
            var pathViejo = './uploads/usuarios/'+usuario.img;
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioGuardado)=>{
                usuarioGuardado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje:'inmgen de usuario actualizado',
                    usuarioGuardado:usuarioGuardado
                });
            })
        })
    }
    if(tipo === 'medicos'){
        Medico.findById(id, (err, medico)=>{
            var pathViejo = './uploads/medicos/'+medico.img;
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            medico.img = nombreArchivo;
            medico.save((err, medicoGuardado)=>{
                return res.status(200).json({
                    ok: true,
                    mensaje:'inmgen de medico actualizado',
                    medicoGuardado:medicoGuardado
                });
            })
        })
        
    }
    if(tipo === 'hospitales'){
        Hospital.findById(id, (err, hospital)=>{
            var pathViejo = './uploads/hospitales/'+hospital.img;
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            hospital.img = nombreArchivo;
            hospital.save((err, hospitalGuardado)=>{
                return res.status(200).json({
                    ok: true,
                    mensaje:'inmgen de hispital actualizado',
                    hospitalGuardado:hospitalGuardado
                });
            })
        })
    }
}

module.exports =app;