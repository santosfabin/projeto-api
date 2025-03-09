const {SECRET_KEY} = require("../config");
const jwt = require("jsonwebtoken");

function permissionVerify(req, res, next) {
	// verificar se o cookie se session_id está presente na requisição
	const sessionToken = req.cookies.session_id;

	if (!sessionToken) {
		// res.status(401).json({error: "Token JWT ausente"});
		res.redirect("/");
		return;
	}

	jwt.verify(sessionToken, SECRET_KEY, (err, decoded) => {
		if (err) {
			// res.status(401).json({error: "Token JWT inválido"});
			res.redirect("/");
			return;
		} else {
			// o token é válido podemos acessar as informações decodificadas

			// armazena as informações do usuário decodidficadas no objeto req
			req.user = decoded.user;

			// passa a requisição para o próximo middleware ou rota
			next();
		}
	});
}

module.exports = permissionVerify;
