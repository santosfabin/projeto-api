const bcryt = require("bcrypt");

// função pra validar uma sena com o hash gerado
async function comparePassword(password, hashedPassword) {
	try {
		// comparando a senha em texto plano com o hash
		const match = await bcryt.compare(password, hashedPassword);

		// retornando true se as senhas corresnponderem, false caso contrário
		return match;
	} catch (e) {
		console.error("Erro ao comparar as senhas: ", error);
		return false;
	}
}

module.exports = comparePassword;
