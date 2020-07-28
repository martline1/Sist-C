const Pacientes = require('../models/Pacientes');
const Expedientes = require('../models/Expedientes')


exports.clinicaHome = async (req,res)=>{
    const pacientes =  await Pacientes.findAll();

    res.render('index',{
        nombrePagina: 'Sistema Clinico',
        pacientes
    });


}

exports.formularioPaciente = async(req,res)=>{
    const pacientes =  await Pacientes.findAll();

    res.render('nuevoPaciente', {
        nombrePagina:'Nuevo paciente',
        pacientes
    })
}

exports.nuevoPaciente =  async(req,res)=>{
    const pacientes =  await Pacientes.findAll();

    //enviar a la consola lo que el usuairio scriiba

   // console.log(req.body)

   //validar que tengamos algo en el imput

   const {nombre} = req.body;

   let errores = [];

   if(!nombre) {
       errores.push({'texto': 'agregar algo al paciente'})
   }

   if(errores.length>0) {
       res.render('nuevoPaciente',{
           nombrePagina: 'Nuevo Paciente',
           errores,
           pacientes
       })
   } else{
       //no hay errores
       //insertar en la BD
       await Pacientes.create({nombre});
       res.redirect('/')
   }
}
exports.pacientePorUrl= async (req,res, next)=>{
    const pacientesPromise =   Pacientes.findAll();
    const pacientePromise =  Pacientes.findOne({
        where:{
            url:req.params.url
        }
    });
    const [pacientes, paciente]= await Promise.all([pacientesPromise,pacientePromise]);

    //consultar tareas del proyecto atual

    const expedientes = await Expedientes.findAll({
        where:{
            pacienteId: paciente.id
        }
    });

    console.log(expedientes);
if(!paciente) return next();

// render a la vista
res.render('expedientes',{
    nombrePagina: 'Expediente del paciente',
    paciente,
    pacientes,
    expedientes
})
}
exports.formularioEditar = async(req,res) =>{
    const pacientesPromise =   Pacientes.findAll();
    const pacientePromise =  Pacientes.findOne({
        where:{
            id:req.params.id
        }
    });
    const [pacientes, paciente]= await Promise.all([pacientesPromise,pacientePromise]);

    res.render('nuevoPaciente',{
        nombrePagina:'Editar Paciente',
        pacientes,
        paciente
    })
}

exports.actualizarPaciente =  async(req,res)=>{
    const pacientes =  await Pacientes.findAll();

    //enviar a la consola lo que el usuairio scriiba

   // console.log(req.body)

   //validar que tengamos algo en el imput

   const {nombre} = req.body;

   let errores = [];

   if(!nombre) {
       errores.push({'texto': 'agregar algo al paciente'})
   }

   if(errores.length>0) {
       res.render('nuevoPaciente',{
           nombrePagina: 'Nuevo Paciente',
           errores,
           pacientes
       })
   } else{
       //no hay errores
       //insertar en la BD
    await Pacientes.update(
        {nombre:nombre},
        {where: {id:req.params.id}}
        );
       res.redirect('/')
   }
}

exports.eliminarPaciente = async (req,res,next)=>{
    //req, quey o params

    const {urlPaciente} = req.query;
    const resultado = await Pacientes.destroy({where: {url: urlPaciente}});

    if(!resultado){
        return next();
    }
    res.send('Paciente eliminado correctamente');

}



