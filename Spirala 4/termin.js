const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
    const termin = sequelize.define('termin', {
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        redovni:Sequelize.BOOLEAN,
        dan:Sequelize.INTEGER,
        datum:Sequelize.STRING,
        semestar:Sequelize.STRING,
        pocetak:Sequelize.TIME,
        kraj:Sequelize.TIME
    })  
    return termin;
};