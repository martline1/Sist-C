const multer  = require("multer");
const shortid = require("shortid");

// Import Own Components
const Pacientes   = require("../models/Pacientes");
const Expedientes = require("../models/Expedientes");

// Opciones de Multer
const configuracionMulter = {
    limits : {
		fileSize : 100000
	},
    storage : fileStorage = multer.diskStorage({
        destination : (req, file, callback) => {
            callback(null, __dirname+"../../public/uploads");
        },
        filename : (req, file, callback) => {
			const extension = file.mimetype.split("/")[1];

            callback(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, callback) {
        if(file.mimetype === "application/pdf" ) {
            // el callback se ejecuta como true o false : true cuando la imagen se acepta
            callback(null, true);
        } else {
            callback(new Error("Formato No Válido"));
        }
    },
};

const upload = multer(configuracionMulter).single("files");

exports.uploadfile = (req, res, next) => {
    upload(req, res, (error) => {
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === "LIMIT_FILE_SIZE") {
                    req.flash("error", "El archivo es muy grande: Máximo 100kb");
                } else {
                    req.flash("error", error.message);
                }
            } else {
                req.flash("error", error.message);
			}

            res.redirect("back");
            return;
        } else {
            return next();
        }
    });
};

exports.agregarExpediente = async (req,res, next) =>{
    //obtenemos pacient actual
	const paciente = await Pacientes.findOne({
		where : {
			url : req.params.url,
		},
	});

	const {
		expediente,
		peso,
		talla,
		edad,
		presionArt,
		temperatura,
		frecResp,
		frecCard,
		historial,
	} = req.body;

    const files          = req.file.filename;
	const { pacienteId } = paciente.id;

	//insertar
	const resultado = await Expedientes.create({
		expediente,
		peso,
		talla,
		edad,
		presionArt,
		temperatura,
		frecResp,
		frecCard,
		historial,
		files,
		pacienteId
	});

	if (!resultado) {
		return next();
	}

	res.redirect(`/pacientes/${req.params.url}`);
};

exports.eleminarExpediente= async (req,res , next) =>{
    const { id }    = req.params;
    const paciente  = await Pacientes.findAll();
    const resultado = await Expedientes.destroy({where:{id}})

    if (!resultado) {
		return next();
	};

    res.status(200).send("Expediente eliminado con exito");
};
