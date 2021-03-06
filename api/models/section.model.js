module.exports = (sequelize, Sequelize) => {
	const Section = sequelize.define('section', {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			unique: true,
			autoIncrement: true,
		},
		creator: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		title: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notNull: {
					msg: 'Please enter a name.',
				},
			},
		},
		description: {
			type: Sequelize.TEXT,
			allowNull: false,
			validate: {
				notNull: {
					msg: 'Please enter a description.',
				},
			},
		},
	});

	return Section;
};
