const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
    const rezervacija = sequelize.define('rezervacija', {
        //id:Sequelize.INTEGER,
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            
        }
    })  
    return rezervacija;
};