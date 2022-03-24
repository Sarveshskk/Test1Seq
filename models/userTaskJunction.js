const sequelize = require("../db")
const Sequelize = require("sequelize");
const User = require("../models/users");
const Task = require("../models/task");
const userTask = sequelize.define("usertasks", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
  },
  task_id: {
    type: Sequelize.INTEGER,
  },
});

User.belongsToMany(Task, {
  through: "usertasks",
  foreignKey: "user_id",
});
Task.belongsToMany(User, {
  through: "usertasks",
  foreignKey: "task_id",
});

module.exports = userTask;