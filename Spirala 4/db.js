const Sequelize = require('sequelize');
const sequelize = new Sequelize('DBWT19', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false
    }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});

const db = {};
db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.osoblje = sequelize.import(__dirname+'/osoblje.js');
db.rezervacija = sequelize.import(__dirname+'/rezervacijaMODUL.js');
db.sala = sequelize.import(__dirname+'/salaMODUL.js');
db.termin = sequelize.import(__dirname+'/termin.js');

//relacije

db.osoblje.hasMany(db.rezervacija, {as: 'osoblje', foreignKey: "osobljeId"});
//dodao novu rezervacija.belognsto
db.rezervacija.belongsTo(db.osoblje);

db.rezervacija.belongsTo(db.termin, {as: 'termin', foreignKey: "terminId"});


db.sala.hasMany(db.rezervacija, {as: 'sala', foreignKey: 'salaId'});
//dodao novu rezervacija.belongsto
db.rezervacija.belongsTo(db.sala);

db.sala.belongsTo(db.osoblje, {as: 'osoblje', foreignKey: "zaduzenaOsoba"});

module.exports = db;