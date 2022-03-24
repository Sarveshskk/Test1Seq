const sequelize = require("../db")
const Sequelize = require("sequelize");
const User = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    role: {
        type: Sequelize.ENUM,
        values: ['user', 'manager', 'admin'],
        defaultValue: 'user',
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
});
User.hasMany(User, {foreignKey: 'manager_id',as:"myusers" });
User.belongsTo(User, {
    foreignKey: "manager_id",
    as: "manager",
  });
module.exports = User;
