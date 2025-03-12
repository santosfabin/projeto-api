const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const permissionVerify = require("./permissionVerify");

// Middleware de verificação de permissão (todos os usuários autenticados)
router.use(permissionVerify.permissionVerify);

// Rota para listar todas as atividades
router.get("/", activityController.getAllActivities);

// Rota para inscrever-se em uma atividade
router.post("/enroll", activityController.enrollInActivity);

// Rota para desinscrever-se de uma atividade
router.post("/unenroll", activityController.unenrollFromActivity);

router.use(permissionVerify.adminVerify);
// Rota para editar-se de uma atividade
router.post("/editActivity", activityController.editActivity);

// Rota para deletar de uma atividade
router.delete("/deleteActivity", activityController.deleteActivity);

// Rota para criar uma nova atividade (somente admin)
router.post("/", activityController.createActivity);

module.exports = router;
