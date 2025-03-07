const bcryt = require("bcrypt");

async function hashPassword(password) {
	try {
		// Gerando um salt (um valor aleatório usado na criação do hash)
		// Número de rounds de geração de salt (quanto maior. mais segura, mas mais lento)
		const salt = await bcryt.genSalt(10);

		// Gerando o hash da senha usando o salt
		const hash = await bcryt.hash(password, salt);

		return hash;
	} catch (e) {
		console.error("Erro ao gerar o hash da senha: ", e);
		return false;
	}
}

module.exports = hashPassword;
