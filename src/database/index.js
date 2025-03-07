// const { default: RocksDB } = require("@salto-io/rocksdb");
const RocksDB = require("@salto-io/rocksdb");
const path = require("path");

class Database {
	constructor(dbName) {
		this.dbPath = path.resolve(__dirname, "../../db_data", dbName);
		this.db = null;
		this.open(e => {
			if (e) {
				console.error("Erro ao abrir o banco de dados:", e);
			}
		});
	}

	open(callback) {
		this.db = new RocksDB(this.dbPath);
		this.db.open(callback);
	}

	close(callback) {
		if (this.db) {
			this.db.close(callback);
		}
	}

	readAllData(callback) {
		if (!this.db) {
			return callback(new Error("O banco de dados não está aberto"));
		}

		const data = [];

		iterator = this.db.iterator({});

		const loop = () => {
			iterator.next((error, key, value) => {
				if (err) {
					iterator.end(() => {
						callback(err);
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
		if (!this.bd) {
			return callback(new Error("O banco de dados não está aberto"));
		}
		this.db.get(key, callback);
	}
}

module.exports = Database;