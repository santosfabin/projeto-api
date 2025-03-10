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

// Rota para criar uma nova atividade (somente admin)
router.post(
	"/",
	permissionVerify.adminVerify,
	activityController.createActivity
);

// Função para remover atividades expiradas (você pode chamar essa função periodicamente, talvez em um cron job)
router.delete("/remove-expired", permissionVerify.adminVerify, (req, res) => {
	activityController.removeExpiredActivities();
	res.status(200).json({message: "Atividades expiradas removidas com sucesso"});
});

module.exports = router;
