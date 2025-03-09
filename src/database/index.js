const RocksDB = require("@salto-io/rocksdb");
const path = require("path");

class Database {
	constructor(dbName) {
		this.dbPath = path.resolve(__dirname, "../../db_data", dbName);
		this._openCallbacks = []; // Array para armazenar as callbacks
		this.open(e => {
			if (e) {
				console.error("Erro ao abrir o banco de dados:", e);
				// Chame as callbacks com o erro, se houver
				this._openCallbacks.forEach(cb => cb(e));
				this._openCallbacks = []; // Limpa as callbacks
				return;
			} 	

			// // apagando o banco de dados
			// this.db.clear(() => {
			// 	// Banco aberto com sucesso, execute as callbacks
			// 	this._openCallbacks.forEach(cb => cb());
			// 	this._openCallbacks = []; // Limpa as callbacks
			// });


			// sem apagar o banco de dados
			this._openCallbacks.forEach(cb => cb());
			this._openCallbacks = []; // Limpa as callbacks
		});
	}

	open(callback) {
		this.db = new RocksDB(this.dbPath);
		this.db.open(callback);
	}

	close(callback) {
		if (this.db) {
			this.db.close(err => {
				if (err) {
					console.error("Erro ao fechar o banco de dados:", err);
				}
				callback(err);
			});
		}
	}

	readAllData(callback) {
		if (!this.db) {
			return callback(new Error("O banco de dados não está aberto"));
		}

		const data = [];

		const iterator = this.db.iterator({});

		const loop = () => {
			iterator.next((error, key, value) => {
				if (error) {
					iterator.end(() => {
						callback(error); // Corrigido: use 'error' aqui
					});
					return;
				}

				if (!key && !value) {
					iterator.end(() => {
						callback(null, data);
					});
					return;
				}

				data.push({key: key.toString(), value: value.toString()});
				loop();
			});
		};

		loop();
	}

	put(key, value, callback) {
		if (!this.db) {
			return callback(new Error("O banco de dados não está aberto"));
		}
		this.db.put(key, value, callback);
	}

	get(key, callback) {
		if (!this.db) {
			return callback(new Error("O banco de dados não está aberto"));
		}

		this.db.get(key, callback);
	}

	onOpen(callback) {
		if (this.db && this.db.isOpen) {
			//Verifica se isOpen é true, senao adiciona o callback no array
			callback(); // Se já estiver aberto, executa imediatamente
		} else {
			this._openCallbacks.push(callback);
		}
	}
}

module.exports = Database;
