const Sequelize = require('sequelize')

const sequelize = new Sequelize('emp', 'root', '12345', {
    host: 'localhost',
    dialect: 'mysql',
});

try {
    sequelize.authenticate();
    console.log('connected to db..');
    sequelize.sync();
} catch (error) {
    console.error('error while connecting..', error);
}
module.exports = sequelize;