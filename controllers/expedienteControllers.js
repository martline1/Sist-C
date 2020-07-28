const Pacientes = require('../models/Pacientes');
const Expedientes = require('../models/Expedientes');
const multer = require('multer');
const shortid = require('shortid');

exports.uploadfile  =  (req, res, next) => {
    upload(req, res, function(error) {
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande: Máximo 100kb');
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else {
            return next();
        }
    });
}


// Opciones de Multer
const configuracionMulter = {
    limits : { fileSize : 100000 },
    storage: fileStorage = multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, __dirname+'../../public/uploads');
        },
        filename : (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'application/pdf' ) {
            // el callback se ejecuta como true o false : true cuando la imagen se acepta
            cb(null, true);
        } else {
            cb(new Error('Formato No Válido'));
        }
    }
}

const upload = multer(configuracionMulter).single('files');

exports.agregarExpediente = async (req,res, next) =>{
    //obtenemos pacient actual
    const paciente = await Pacientes.findOne({where: {url: req.params.url}});

   
    const {expediente} = req.body;
    const {peso} = req.body;
    const{talla} = req.body;
    const{edad} = req.body;
    const {presionArt} = req.body;
    const {temperatura} = req.body;
    const{frecResp} = req.body;
    const {frecCard} = req.body;
    const{historial} = req.body;
    const files = req.file.filename;
    const {pacienteId}= paciente.id;
      //insertar
      const resultado = await Expedientes.create({expediente, peso,talla,edad,presionArt,temperatura,frecResp,frecCard,historial,files,pacienteId});
      if(!resultado){
          return next();
      }
  
      res.redirect(`/pacientes/${req.params.url}`);

}

    



exports.eleminarExpediente= async (req,res , next) =>{
    const{id} = req.params;
    const paciente= await Pacientes.findAll();



    const resultado = await Expedientes.destroy({where:{id}})

    if(!resultado) { return next()
    } 
    
    res.status(200).send('Expediente eliminado con exito');

}


