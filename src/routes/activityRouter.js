// /home/gengar/alpha/projeto_api_parte2/src/routes/activityRouter.js
const express = require("express");
const Activity = require("../models/Activity");
const User = require("../models/User");
const activityRouter = express.Router();

// Helper functions to check auth
async function isAdmin(userId) {
	return await User.isAdmin(userId);
}

// List all activities (accessible to all)
activityRouter.get("/", async (req, res) => {
	//removed isAuthenticated
	const activities = Activity.findAll();
	res.json(activities);
});

// Create activity (admin only)
activityRouter.post("/", async (req, res) => {
	//removed isAuthenticated
	if (!(await isAdmin(req.user.id)))
		return res.status(403).json({error: "forbidden, user is not admin"}); //changed req.user.user.id to req.user.id
	const {title, description} = req.body;
    try {
        const activity = Activity.create(title, description);
        res.status(201).json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a single activity (accessible to all)
activityRouter.get("/:id", async (req, res) => {
	//removed isAuthenticated
	const activity = Activity.findById(parseInt(req.params.id));
	if (!activity) {
		return res.status(404).json({error: "Atividade não encontrada."});
	}
	res.json(activity);
});

// Update activity (admin only)
activityRouter.put("/:id", async (req, res) => {
	//removed isAuthenticated
	if (!(await isAdmin(req.user.id)))
		return res.status(403).json({error: "forbidden, user is not admin"}); //changed req.user.user.id to req.user.id
	const activity = Activity.findById(parseInt(req.params.id));
	if (!activity) {
		return res.status(404).json({error: "Atividade não encontrada."});
	}
	const {title, description} = req.body;
    try {
		Activity.validateUniqueTitle(activity.id, title); //validate here
        activity.update(title, description);
        res.json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete activity (admin only)
activityRouter.delete("/:id", async (req, res) => {
	//removed isAuthenticated
	if (!(await isAdmin(req.user.id)))
		return res.status(403).json({error: "forbidden, user is not admin"}); //changed req.user.user.id to req.user.id
	const activity = Activity.findById(parseInt(req.params.id));
	if (!activity) {
		return res.status(404).json({error: "Atividade não encontrada."});
	}
	Activity.delete(parseInt(req.params.id));
	res.json({message: "Atividade removida com sucesso."});
});

// Subscribe to activity (accessible to all)
activityRouter.post("/:id/subscribe", async (req, res) => {
	//removed isAuthenticated
	const activity = Activity.findById(parseInt(req.params.id));
	if (!activity) {
		return res.status(404).json({error: "Atividade não encontrada."});
	}
	activity.subscribe(req.user.id); //changed req.user.user.id to req.user.id
	res.json({message: "Inscrição realizada com sucesso."});
});

// Unsubscribe from activity (accessible to all)
activityRouter.post("/:id/unsubscribe", async (req, res) => {
	//removed isAuthenticated
	const activity = Activity.findById(parseInt(req.params.id));
	if (!activity) {
		return res.status(404).json({error: "Atividade não encontrada."});
	}
	activity.unsubscribe(req.user.id); //changed req.user.user.id to req.user.id
	res.json({message: "Inscrição cancelada com sucesso."});
});

// List subscribers (admin only)
activityRouter.get("/:id/subscribers", async (req, res) => {
	//removed isAuthenticated
	if (!(await isAdmin(req.user.id)))
		return res.status(403).json({error: "forbidden, user is not admin"}); //changed req.user.user.id to req.user.id
	const activity = Activity.findById(parseInt(req.params.id));
	if (!activity) {
		return res.status(404).json({error: "Atividade não encontrada."});
	}
	const subscribers = activity.getSubscribers().map(userId => {
		return User.findUserById(userId);
	});
	res.json(subscribers);
});

module.exports = {activityRouter, isAdmin}; //only isAdmin now
