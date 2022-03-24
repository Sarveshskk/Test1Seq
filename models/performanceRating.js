const sequelize = require("../db")
const Sequelize = require("sequelize");
const TaskPerformance = sequelize.define("taskPerformance", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  task_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  task_rating: {
    type: Sequelize.INTEGER,
    allowNull: false
},
});

module.exports = TaskPerformance;