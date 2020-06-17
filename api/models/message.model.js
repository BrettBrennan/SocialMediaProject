module.exports = (sequelize, Sequelize) => {
	const Message = sequelize.define('message', {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4, // Or Sequelize.UUIDV1
			allowNull: false,
			primaryKey: true,
			unique: true,
		},
		sender: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		receiver: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		message: {
			type: Sequelize.TEXT,
			allowNull: false,
			validate: {
				notNull: {
					msg: 'Please enter a message.',
				},
			},
		},
		read: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	});

	return Message;
};
