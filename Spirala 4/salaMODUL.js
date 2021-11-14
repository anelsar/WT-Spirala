const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
    const sala = sequelize.define('sala', {
        //id:Sequelize.INTEGER,
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        naziv:Sequelize.STRING
    })  
    return sala;
};