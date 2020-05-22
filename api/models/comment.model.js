module.exports = (sequelize, Sequelize) => {
	const Comment = sequelize.define('comment', {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4, // Or Sequelize.UUIDV1
			allowNull: false,
			primaryKey: true,
			unique: true,
		},
		post_id: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		creator: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		msg: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notNull: {
					msg: 'Please enter a comment.',
				},
			},
		},
	});

	return Comment;
};
