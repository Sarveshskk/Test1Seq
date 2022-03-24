const sequelize = require("../db")
const Sequelize = require("sequelize");
const User = require("../models/users")
const Task = sequelize.define("task", {
    task_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    manager_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    task_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
    },
    task_status: {
        type: Sequelize.ENUM,
        values: ['open', 'ready', 'inreview', 'completed'],
        defaultValue: 'open',
    },
    

});



module.exports = Task;
