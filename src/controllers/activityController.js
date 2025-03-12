const activityDb = require("../activityDb")(); // Banco de dados das atividades

// Função para criar uma nova atividade (somente admin)
const createActivity = (req, res) => {
	const {title, description, location, maxParticipants, deadline} = req.body;

	if (!title || !description || !location || !maxParticipants || !deadline) {
		return res.status(400).json({error: "Todos os campos são obrigatórios!"});
	}

	const activityDeadline = new Date(deadline);
	if (isNaN(activityDeadline.getTime())) {
		return res.status(400).json({error: "Data limite inválida!"});
	}

	const now = new Date();
	// Verifica se a data limite é no futuro
	if (activityDeadline <= now) {
		return res
			.status(400)
			.json({error: "A data limite deve ser uma data futura!"});
	}

	const activityId = `activity_${Date.now()}`;
	const activity = {
		activityId,
		title,
		description,
		location,
		maxParticipants,
		deadline,
		participants: []
	};

	activityDb.put(activityId, JSON.stringify(activity), err => {
		if (err) {
			return res.status(500).json({error: "Erro ao salvar atividade!"});
		}
		res.status(201).json({message: "Atividade criada!", activity});
	});
};

// Função para editar uma atividade (somente admin)
const editActivity = (req, res) => {
	const {activityId, title, description, location, maxParticipants, deadline} =
		req.body;

	if (!activityId) {
		return res.status(400).json({error: "O ID da atividade é obrigatório!"});
	}

	activityDb.readAllData((err, data) => {
		if (err) {
			return res
				.status(500)
				.json({error: "Erro ao acessar o banco de dados de atividades"});
		}

		const activityIndex = data.findIndex(
			item => JSON.parse(item.value).activityId === activityId
		);
		if (activityIndex === -1) {
			return res.status(404).json({error: "Atividade não encontrada"});
		}

		let activityObj = JSON.parse(data[activityIndex].value);

		// Atualiza apenas os campos fornecidos
		if (title) activityObj.title = title;
		if (description) activityObj.description = description;
		if (location) activityObj.location = location;
		if (maxParticipants) activityObj.maxParticipants = maxParticipants;
		if (deadline) {
			const activityDeadline = new Date(deadline);
			if (isNaN(activityDeadline.getTime())) {
				return res.status(400).json({error: "Data limite inválida!"});
			}
			activityObj.deadline = deadline;
		}

		// Atualiza a atividade no banco de dados
		activityDb.put(activityId, JSON.stringify(activityObj), err => {
			if (err) {
				return res.status(500).json({error: "Erro ao atualizar a atividade"});
			}

			res.status(200).json({
				message: "Atividade atualizada com sucesso!",
				activity: activityObj
			});
		});
	});
};

// Função para listar todas as atividades
const getAllActivities = (req, res) => {
	activityDb.readAllData((err, data) => {
		// vendo o usuario atual
		if (err) {
			return res
				.status(500)
				.json({error: "Erro ao acessar o banco de dados de atividades"});
		}

		const now = new Date();
		const validActivities = [];

		data.forEach(item => {
			let activity;
			try {
				activity = JSON.parse(item.value); // Convertendo para objeto
			} catch (parseError) {
				console.log(`Erro ao parsear a atividade ${item.key}`);
				return;
			}

			let activityDeadline = new Date(activity.deadline);
			if (isNaN(activityDeadline.getTime())) {
				console.log(`Deadline inválido para a atividade: ${activity.title}`);
				return;
			}

			// Verifica se a data da atividade é maior que a data atual
			if (activityDeadline > now) {
				validActivities.push(activity); // Adiciona à lista se a data for válida
			}
		});

		// Retorna as atividades válidas em formato JSON
		res.status(200).json(validActivities);
	});
};

// Função para inscrever-se em uma atividade
const enrollInActivity = (req, res) => {
	const userKey = `user_${req.user.email}`;
	const {activityId} = req.body;

	activityDb.readAllData((err, data) => {
		if (err) {
			return res
				.status(500)
				.json({error: "Erro ao acessar o banco de dados de atividades"});
		}

		const activity = data.find(
			item => JSON.parse(item.value).activityId === activityId
		);
		if (!activity) {
			return res.status(404).json({error: "Atividade não encontrada"});
		}

		const activityObj = JSON.parse(activity.value);

		// Verifique se o número máximo de participantes não foi atingido
		if (activityObj.participants.length >= activityObj.maxParticipants) {
			return res
				.status(400)
				.json({error: "Número máximo de participantes atingido"});
		}

		// Verifica se o usuário já está inscrito
		if (activityObj.participants.includes(userKey)) {
			return res
				.status(400)
				.json({error: "Você já está inscrito nessa atividade"});
		}

		// Inscreve o usuário
		activityObj.participants.push(userKey);

		// Atualiza a atividade no banco de dados
		activityDb.put(activityId, JSON.stringify(activityObj), err => {
			if (err) {
				return res.status(500).json({error: "Erro ao atualizar a atividade"});
			}

			res.status(200).json({
				message: "Inscrição realizada com sucesso!",
				activity: activityObj
			});
		});
	});
};

// Função para desinscrever-se de uma atividade
const unenrollFromActivity = (req, res) => {
	const {activityId} = req.body; // ID da atividade de onde o usuário deseja se desinscrever
	const userKey = `user_${req.user.email}`; // Chave do usuário autenticado

	// Encontra a atividade pela ID
	activityDb.readAllData((err, data) => {
		if (err) {
			return res
				.status(500)
				.json({error: "Erro ao acessar o banco de dados de atividades"});
		}

		// Procura pela atividade desejada
		const activity = data.find(
			item => JSON.parse(item.value).activityId === activityId
		);

		if (!activity) {
			return res.status(404).json({error: "Atividade não encontrada"});
		}

		const activityObj = JSON.parse(activity.value);

		// Verifica se o usuário está inscrito
		const participantIndex = activityObj.participants.indexOf(userKey);
		if (participantIndex === -1) {
			return res
				.status(400)
				.json({error: "Você não está inscrito nessa atividade"});
		}

		// Remove o usuário da lista de participantes
		activityObj.participants.splice(participantIndex, 1);

		// Atualiza a atividade no banco de dados
		activityDb.put(activityId, JSON.stringify(activityObj), err => {
			if (err) {
				return res.status(500).json({error: "Erro ao atualizar a atividade"});
			}

			res.status(200).json({
				message: "Desinscrição realizada com sucesso!",
				activity: activityObj
			});
		});
	});
};

// Função para remover atividades expiradas
const deleteActivity = (req, res) => {
	const {activityId} = req.body;

	if (!activityId) {
		return res.status(400).json({error: "O ID da atividade é obrigatório!"});
	}

	activityDb.readAllData((err, data) => {
		if (err) {
			return res
				.status(500)
				.json({error: "Erro ao acessar o banco de dados de atividades"});
		}

		const activityIndex = data.findIndex(
			item => JSON.parse(item.value).activityId === activityId
		);
		if (activityIndex === -1) {
			return res.status(404).json({error: "Atividade não encontrada"});
		}

		// Remove a atividade do banco de dados
		activityDb.del(activityId, err => {
			if (err) {
				return res.status(500).json({error: "Erro ao excluir a atividade"});
			}

			res.status(200).json({message: "Atividade excluída com sucesso!"});
		});
	});
};

module.exports = {
	createActivity,
	getAllActivities,
	enrollInActivity,
	unenrollFromActivity,
	deleteActivity,
	editActivity
};
