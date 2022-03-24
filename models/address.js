const sequelize = require("../db");
const User = require("./users");
const Sequelize = require("sequelize");
const Address = sequelize.define("address", {
    address_id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    pin_code: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    phone_no: {
        type: Sequelize.BIGINT(11),
        allowNull: false
    },
});
User.hasMany(Address, {foreignKey: 'user_id',as:"myaddress" });
Address.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });
module.exports = Address;
