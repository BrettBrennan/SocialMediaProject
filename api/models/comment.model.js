module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please enter a name.",
                },
            },
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please enter an email.",
                },
            },
        },
    });

    return Comment;
};
