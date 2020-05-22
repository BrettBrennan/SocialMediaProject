const config = require('config');

module.exports = {
	HOST: config.get('dbHost'),
	USER: config.get('dbUser'),
	PASSWORD: config.get('dbPass'),
	DB: config.get('dbName'),
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
};
