module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('user', {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4, // Or Sequelize.UUIDV1
			allowNull: false,
			primaryKey: true,
			unique: true,
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notNull: {
					msg: 'Please enter a name.',
				},
			},
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notNull: {
					msg: 'Please enter an email.',
				},
			},
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notNull: {
					msg: 'Please enter a password.',
				},
			},
		},
	});

	return User;
};
