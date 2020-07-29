const express  = require("express");
const router   = express.Router();
const { body } = require("express-validator/check");

// Import Models
const Expedientes = require("../models/Expedientes");

// Import Controllers
const clinicaControllers    = require("../controllers/clinicaControllers");
const expedienteControllers = require("../controllers/expedienteControllers");

module.exports = function() {
    router.get("/",clinicaControllers.clinicaHome);
    router.get("/nuevo-paciente", clinicaControllers.formularioPaciente);
    router.post("/nuevo-paciente",
        body("nombre").not().isEmpty().trim().escape(),
    clinicaControllers.nuevoPaciente);
    //listar proycto
    router.get("/pacientes/:url", clinicaControllers.pacientePorUrl);

    //actualizar proyecto
    router.get("/pacientes/editar/:id", clinicaControllers.formularioEditar);
    router.post("/nuevo-paciente/:id",
        body("nombre").not().isEmpty().trim().escape(),
    clinicaControllers.actualizarPaciente);
    
    //eliminar proyecto
    router.delete("/pacientes/:url",
    clinicaControllers.eliminarPaciente);

    
    router.post("/pacientes/:url",expedienteControllers.agregarExpediente,expedienteControllers.uploadfile);

    //eliminar expediente

	router.delete("/expedientes/:id",expedienteControllers.eleminarExpediente);

    return router;
};

//`/pacientes/${paciente.url}`