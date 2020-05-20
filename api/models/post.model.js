module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4, // Or Sequelize.UUIDV1
            allowNull: false,
            primaryKey: true,
            unique: true,
        },
        section_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
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
                    msg: "Please enter a name.",
                },
            },
        },
        body: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please enter a description.",
                },
            },
        },
        isPublic: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    return Post;
};
