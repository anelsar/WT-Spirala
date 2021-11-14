/*
var db = require('./db.js');
db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    })
    console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
});

function inicializacija(){
    var osobljeListaPromisea = [];
    var terminiListaPormisea = [];
    var rezervacijaListaPromisea = [];
    var salaListaPromisea = [];
    return new Promise(function(resolve, reject){
        // ubacivanje osoblja
        osobljeListaPromisea.push(db.osoblje.create({ime: "Neko", prezime: "Nekic", uloga: "profesor"}));
        osobljeListaPromisea.push(db.osoblje.create({ime: "Drugi", prezime: "Neko", uloga: "asistent"}));
        osobljeListaPromisea.push(db.osoblje.create({ime: "Test", prezime: "Test", uloga: "asistent"}));
        // ubacivanje termina
        terminiListaPormisea.push(db.termin.create({redovni: false, dan: null, datum: "01.01.2020", semestar: null, pocetak: "12:00", kraj: "13:00"}));
        terminiListaPormisea.push(db.termin.create({redovni: true, dan: 0, datum: null, semestar: "zimski", pocetak: "13:00", kraj: "14:00"}));
        Promise.all(osobljeListaPromisea).then(function(osobe){
            var neko = osobe.filter(function(a){return a.ime === "Neko"})[0].dataValues.id;
            var drugi = osobe.filter(function(a){return a.ime === "Drugi"})[0].dataValues.id;
           var test = osobe.filter(function(a){return a.ime === "Test"})[0].dataValues.id;
           // console.log(osobe, neko);
        Promise.all(terminiListaPormisea).then(function(termini){
            var prviTermin = termini.filter(function(a){return a.redovni == false})[0].dataValues.id;
            var drugiTermin = termini.filter(function(a){return a.redovni == true})[0].dataValues.id;
            // ubacivanje sala
            salaListaPromisea.push(
                db.sala.create({naziv: "1-11"}).then(function(k){
                    k.setOsoblje([neko]);
                    return new Promise(function(resolve, reject){resolve(k);});
                })
                );
            salaListaPromisea.push(
                db.sala.create({naziv: "1-15"}).then(function(k){
                    k.setOsoblje([drugi]);
                    return new Promise(function(resolve, reject){resolve(k);});
                })
            );
            
            Promise.all(salaListaPromisea).then(function(sale){
                var prvaSala = sale.filter(function(a){return a.naziv === "1-11"})[0].dataValues.id;
                var drugaSala = sale.filter(function(a){return a.naziv === "1-15"})[0].dataValues.id;
                rezervacijaListaPromisea.push(
                    db.rezervacija.create({}).then(function(k){
                       return k.setTermin([prviTermin]).then(function(k){
                           return k.setSala([prvaSala]).then(function(k){
                               return k.setOsoblje([neko]).then(function(){
                                   return new Promise(function(resolve, reject){resolve(k);});
                               })
                           })
                       });
                       
                    })
                );
                // ubacivanje rezervacija
                rezervacijaListaPromisea.push(
                    db.rezervacija.create({}).then(function(k){
                       return k.setTermin([drugiTermin]).then(function(k){
                           return k.setSala([prvaSala]).then(function(k){
                               return k.setOsoblje([test]).then(function(){
                                   return new Promise(function(resolve, reject){resolve(k);});
                               })
                           })
                       });
                       
                    })
                );
                Promise.all(rezervacijaListaPromisea).then(function(k){resolve(k);}).catch(function(err){console.log("Greska kod rezervacije "+err);});
            }).catch(function(err){console.log("Greska kod sala " + err);});
        }).catch(function(err){console.log("Greska kod termina " + err);});
        }).catch(function(err){console.log("Greska kod osoba " + err);});
    });
}
*/